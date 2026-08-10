import { NextResponse } from "next/server";

import { registerSchema } from "@/validators/auth.schema";
import { registerUser } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    // Check Content-Type
    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          message: "Content-Type must be application/json",
        },
        { status: 415 }
      );
    }

    // Parse body
    const body: unknown = await request.json();

    // Validate request
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid registration data",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Business Logic
    const createdUser = await registerUser(validationResult.data);

    // Success Response
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: {
          user: createdUser,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return NextResponse.json(
          {
            success: false,
            message: "An account with this email already exists",
          },
          { status: 409 }
        );
      }
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create account",
      },
      { status: 500 }
    );
  }
}