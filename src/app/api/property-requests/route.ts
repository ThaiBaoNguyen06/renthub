import { NextResponse, NextRequest} from "next/server";
import {requireRole} from "@/lib/permissions";
import {createPropertyRequestSchema} from "@/validators/property-request.schema";
import {createPropertyRequest} from "@/services/property-request.service";

export async function POST(request: NextRequest){
    try{
        const session = await requireRole(["host"]);
        const body =  await request.json();
        const validation= createPropertyRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                success: false,
                message: "Invalid property request data",
                errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }
        return NextResponse.json({
            success: true,
            message: "Property request created successfully",
            data:{
                propertyRequesty,
            },
        },
        {
            status: 201
        });
    } catch(error){
        if(error instanceOf Error){
            if(error.message === "UNAUTHORIZED"){
                return NextResponse.json({
                    success: false,
                    message: "Authentication required",
                },
                {status: 401});
            }
            if (error.message === "FORBIDDEN") {
                return NextResponse.json(
                {
                    success: false,
                    message: "Only hosts can create property requests",
                },
                { status: 403 }
                );
            }
        }
        console.error("Create property request error:", error);
        return NextResponse.json(
        {
            success: false,
            message: "Unable to create property request",
        },
        { status: 500 }
        );
    }
}