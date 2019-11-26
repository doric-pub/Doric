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
     * Set the amount of rotation to apply to the progress spinner.
     *
     * @param rotation Rotation is from [0..2]
     */
    void setProgressRotation(float rotation);
}
