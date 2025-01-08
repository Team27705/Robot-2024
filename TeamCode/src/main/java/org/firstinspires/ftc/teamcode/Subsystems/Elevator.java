package org.firstinspires.ftc.teamcode.Subsystems;

import com.qualcomm.robotcore.hardware.DcMotor;
import com.qualcomm.robotcore.hardware.HardwareMap;

public class Elevator {

    private DcMotor elevatorMotor;
    private final int MAX_POSITION = 10000;  // This would be a hypothetical max position for the elevator.
    private final int MIN_POSITION = 0;      // This is the minimum position (e.g., fully lowered).

    // Constructor
    public Elevator(HardwareMap hardwareMap) {
        // Initialize the motor for the elevator
        elevatorMotor = hardwareMap.get(DcMotor.class, "elevatorMotor");

        // Set the motor direction (this might need to be adjusted depending on your robot's configuration)
        elevatorMotor.setDirection(DcMotor.Direction.FORWARD);

        // Set the motor to run without encoders for now (can be modified to run with encoders for precise control)
        elevatorMotor.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
    }

    // Function to raise the elevator (positive power)
    public void raiseElevator(double power) {
        // Ensure that the elevator doesn't exceed the maximum position
        if (getElevatorPosition() < MAX_POSITION) {
            elevatorMotor.setPower(power);
        } else {
            stopElevator();  // Stop the elevator if it's at the max position
        }
    }

    // Function to lower the elevator (negative power)
    public void lowerElevator(double power) {
        // Ensure that the elevator doesn't go below the minimum position
        if (getElevatorPosition() > MIN_POSITION) {
            elevatorMotor.setPower(-power);
        } else {
            stopElevator();  // Stop the elevator if it's at the minimum position
        }
    }

    // Function to stop the elevator motor
    public void stopElevator() {
        elevatorMotor.setPower(0);
    }

    // Function to get the current position of the elevator (if using encoders)
    public int getElevatorPosition() {
        // In this case, we're not using encoders, but if you were, you'd use something like:
        // return elevatorMotor.getCurrentPosition();
        return 0;  // Placeholder value until encoder support is implemented
    }

    // Function to set the motor mode (useful for switching between position control and power control)
    public void setElevatorMode(DcMotor.RunMode mode) {
        elevatorMotor.setMode(mode);
    }

    // Function to reset the encoder to 0 (useful when you want to set the home position)
    public void resetElevatorEncoder() {
        elevatorMotor.setMode(DcMotor.RunMode.STOP_AND_RESET_ENCODER);
        elevatorMotor.setMode(DcMotor.RunMode.RUN_WITHOUT_ENCODER);
    }
}

