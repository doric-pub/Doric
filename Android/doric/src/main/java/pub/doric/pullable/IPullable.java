package pub.doric.pullable;

/**
 * @Description: pub.doric.pullable
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-25
 */
public interface IPullable {

    void startAnimation();

    void stopAnimation();

    /**
     * run the animation after pull request success and before stop animation
     *
     * @return the duration of success animation or 0 if no success animation
     */
    int successAnimation();

    /**
     * Set the amount of rotation to apply to the progress spinner.
     *
     * @param rotation Rotation is from [0..1]
     */
    void setProgressRotation(float rotation);
}
