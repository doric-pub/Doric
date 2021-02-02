#include "context.h"
#include "native_driver.h"
#include "context_manager.h"
#include "utils/constant.h"

Context::Context(QString contextId, QString source, QString extra)
{
    this->mRootNode = new RootNode();

    this->mContextId = contextId;
    this->source = source;
    this->extra = extra;
}

Context* Context::create(QString script, QString source, QString extra)
{
    Context *context = ContextManager::getInstance()->createContext(script, source, extra);
    context->script = script;
    context->init(extra);

    QVariantList args;
    context->callEntity(Constant::DORIC_ENTITY_CREATE, args);
    return context;
}

void Context::init(QString initData)
{
    this->extra = initData;
    if (!initData.isEmpty()) {
        QVariantList args;
        args.push_back(initData);
        callEntity(Constant::DORIC_ENTITY_INIT, args);
    }
}

void Context::build(int width, int height)
{
    QMap<QString, QVariant> map;
    map.insert("width", QVariant(width));
    map.insert("height", QVariant(height));
    QVariant jsValue(map);
    this->initParams = jsValue;

    QVariantList args;
    args.push_back(this->initParams);
    callEntity(Constant::DORIC_ENTITY_BUILD, args);
}

void Context::callEntity(QString methodName, QVariantList args)
{
    return getDriver()->invokeContextEntityMethod(this->mContextId, methodName, args);
}

InterfaceDriver* Context::getDriver()
{
    if (driver == NULL)
    {
        driver = NativeDriver::getInstance();
        return driver;
    }
    return driver;
}
