package org.firstinspires.ftc.teamcode.Subsystems;

import static org.firstinspires.ftc.robotcore.external.BlocksOpModeCompanion.hardwareMap;

import com.arcrobotics.ftclib.drivebase.MecanumDrive;
import com.qualcomm.robotcore.hardware.HardwareMap;
import com.qualcomm.robotcore.hardware.DcMotor;
import com.arcrobotics.ftclib.hardware.motors.Motor;



public class Drivetrain {
    Motor fL = new Motor(hardwareMap, "frontLeftMotor");
    Motor bL = new Motor(hardwareMap, "backLeftMotor");
    Motor fR = new Motor(hardwareMap, "frontRightMotor");
    Motor bR = new Motor(hardwareMap, "backRightMotor");

    DcMotor frontLeft = fL.motor;
    DcMotor backLeft = bL.motor;
    DcMotor frontRight = fR.motor;
    DcMotor backRight = bR.motor;

    MecanumDrive mecanum = new MecanumDrive(fL, bL,
            fR, bR);
    e
}
/*
package org.firstinspires.ftc.teamcode.Subsystems;

import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.HardwareMap;

public class Drivetrain {

    private DcMotor motorOne;
    private DcMotor motorTwo;
    private DcMotor motorThree;
    private DcMotor motorFour;

    // Optional: Constants for motor power scaling (fine-tune if necessary)
    private static final double MAX_POWER = 1.0;
    private static final double MIN_POWER = 0.0;

    // Constructor for drivetrain class
    public Drivetrain(HardwareMap hardwareMap) {
        // Initialize motors
        motorOne = hardwareMap.get(DcMotor.class, "motorOne");
        motorTwo = hardwareMap.get(DcMotor.class, "motorTwo");
        motorThree = hardwareMap.get(DcMotor.class, "motorThree");
        motorFour = hardwareMap.get(DcMotor.class, "motorFour");

        // Set motor directions (adjust these based on your robot's wiring)
        motorOne.setDirection(DcMotor.Direction.FORWARD);
        motorTwo.setDirection(DcMotor.Direction.FORWARD);
        motorThree.setDirection(DcMotor.Direction.FORWARD);
        motorFour.setDirection(DcMotor.Direction.FORWARD);

        // Set motors to run without encoders by default
        motorOne.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
        motorTwo.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
        motorThree.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
        motorFour.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);

        // Optional: Set motors to brake when stopped (instead of coasting)
        motorOne.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        motorTwo.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        motorThree.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
        motorFour.setZeroPowerBehavior(DcMotor.ZeroPowerBehavior.BRAKE);
    }

    // Function to drive the robot forward
    public void driveForward(double power) {
        // Ensure power is within valid range (between MIN_POWER and MAX_POWER)
        power = scalePower(power);
        motorOne.setPower(power);
        motorTwo.setPower(power);
        motorThree.setPower(power);
        motorFour.setPower(power);
    }

    // Function to drive the robot backward
    public void driveBackward(double power) {
        // Ensure power is within valid range
        power = scalePower(power);
        motorOne.setPower(-power);
        motorTwo.setPower(-power);
        motorThree.setPower(-power);
        motorFour.setPower(-power);
    }

    // Function to turn the robot left (counterclockwise)
    public void turnLeft(double power) {
        // Ensure power is within valid range
        power = scalePower(power);
        motorOne.setPower(-power);
        motorTwo.setPower(power);
        motorThree.setPower(-power);
        motorFour.setPower(power);
    }

    // Function to turn the robot right (clockwise)
    public void turnRight(double power) {
        // Ensure power is within valid range
        power = scalePower(power);
        motorOne.setPower(power);
        motorTwo.setPower(-power);
        motorThree.setPower(power);
        motorFour.setPower(-power);
    }

    // Function to stop the robot
    public void stop() {
        motorOne.setPower(0);
        motorTwo.setPower(0);
        motorThree.setPower(0);
        motorFour.setPower(0);
    }

    // Optional: Use encoders for precise movement control
    public void driveWithEncoders(double power) {
        motorOne.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        motorTwo.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        motorThree.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        motorFour.setMode(DcMotor.RunMode.RUN_USING_ENCODER);
        
        driveForward(power);  // Default to moving forward with encoders
    }

    // Optional: Stop using encoders and reset to run without encoders
    public void stopWithEncoders() {
        motorOne.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
        motorTwo.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
        motorThree.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
        motorFour.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
    }

    // Helper function to scale motor power to ensure it stays within the valid range
    private double scalePower(double power) {
        // Scale power within the valid range
        return Math.max(MIN_POWER, Math.min(MAX_POWER, power));
    }
}
*/
