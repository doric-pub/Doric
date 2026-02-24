#include <condition_variable>
#include <functional>
#include <future>
#include <mutex>
#include <queue>
#include <thread>

class SingleThreadExecutor {
public:
    SingleThreadExecutor() : running(true) { worker = std::thread(&SingleThreadExecutor::run, this); }

    ~SingleThreadExecutor() { stop(); }

    template <typename Func, typename... Args>
    auto submit(Func &&func, Args &&...args) -> std::future<decltype(func(args...))> {
        using ReturnType = decltype(func(args...));
        auto task = std::make_shared<std::packaged_task<ReturnType()>>(
            std::bind(std::forward<Func>(func), std::forward<Args>(args)...));

        std::future<ReturnType> result = task->get_future();
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            if (!running) {
                throw std::runtime_error("Executor is not running");
            }
            tasks.push([task]() { (*task)(); });
        }
        condition.notify_one();
        return result;
    }

    void stop() {
        {
            std::unique_lock<std::mutex> lock(queue_mutex);
            running = false;
        }
        condition.notify_all();
        if (worker.joinable()) {
            worker.join();
        }
    }

private:
    void run() {
        while (running) {
            std::function<void()> task;
            {
                std::unique_lock<std::mutex> lock(queue_mutex);
                condition.wait(lock, [this] { return !tasks.empty() || !running; });
                if (!running && tasks.empty()) {
                    break;
                }
                task = std::move(tasks.front());
                tasks.pop();
            }
            task();
        }
    }

    std::thread worker;
    std::queue<std::function<void()>> tasks;
    std::mutex queue_mutex;
    std::condition_variable condition;
    bool running;
};