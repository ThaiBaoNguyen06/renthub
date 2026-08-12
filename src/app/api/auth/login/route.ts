import {NextResponse} from "next/server";
import {loginSchema} from "@/validators/auth.schema";
import{loginUser} from "@/services/auth.service";

export async function POST(request: Request){
    try{
        const contentType = request.headers.get("content-type");
        if(!contentType?.includes("application/json")){
            return NextResponse.json({
                success: false,
                message: "Content-Type must be application/json",
            },
            {status: 415});
        }
        const body: unknown = await request.json();
        const validationResult = loginSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                success: false,
                message: "Invalid login data",
                errors: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }
        const user = await loginUser(validationResult.data);
            return NextResponse.json(
        {
            success: true,
            message: "Login successful",
            data: {
            user,
            },
        },
        { status: 200 }
        );
    }catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_CREDENTIALS") {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email or password",
          },
          { status: 401 }
        );
      }

      if (error.message === "ACCOUNT_NOT_ACTIVE") {
        return NextResponse.json(
          {
            success: false,
            message: "This account is not active",
          },
          { status: 403 }
        );
      }
    }

    console.error("Login API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to log in",
      },
      { status: 500 }
    );
  }
}