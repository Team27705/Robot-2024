package org.firstinspires.ftc.teamcode.Subsystems;

import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.HardwareMap;

public class Intake {

    private DcMotor intakeMotor;

    // Constructor
    public Intake(HardwareMap hardwareMap) {
        // Initialize the motor for the intake system
        intakeMotor = hardwareMap.get(DcMotor.class, "intakeMotor");

        // Set motor direction, you may need to adjust this based on how your intake is wired
        intakeMotor.setDirection(DcMotor.Direction.FORWARD);

        // Set the motor to run without encoders for now (you can change this if you need precise control)
        intakeMotor.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
    }

    // Function to run the intake forwards (sucking in)
    public void runIntakeIn(double power) {
        intakeMotor.setPower(power);  // Positive power for intake
    }

    // Function to run the intake backwards (spitting out)
    public void runIntakeOut(double power) {
        intakeMotor.setPower(-power);  // Negative power for ejection
    }

    // Function to stop the intake
    public void stopIntake() {
        intakeMotor.setPower(0);
    }

    // Optional: If using encoders, get the current position of the intake motor
    public int getIntakePosition() {
        // Return the current position of the intake motor (if using encoders)
        return intakeMotor.getCurrentPosition();
    }

    // Optional: Set the motor mode (if you're using encoders or position control)
    public void setIntakeMode(DcMotor.RunMode mode) {
        intakeMotor.setMode(mode);
    }

    // Optional: Reset the intake motor's encoder (useful if you use encoders and need to recalibrate)
    public void resetIntakeEncoder() {
        intakeMotor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
        intakeMotor.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
    }
}

