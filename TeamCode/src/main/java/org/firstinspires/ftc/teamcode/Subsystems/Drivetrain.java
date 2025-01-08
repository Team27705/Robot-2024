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
}
