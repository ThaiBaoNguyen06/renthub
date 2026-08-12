import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {authOptions} from "@/app/auth";

export async function GET(){
    try{
        const session = await getServerSession(authOptions);
        if(!session?.user){
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
            },
         {status: 401});
        }
        return NextResponse.json({
            success: true,
            data: {
                user: session.user,
            },
        },
        {status: 200});
    } catch(error){
        if(error instanceof Error && error.message === "UNAUTHORIZED"){
            return NextResponse.json({
                success:false,
                message: "Authentication required",
            },
            {status: 401});
        }
        console.error("get current user error: ", error);
        return NextResponse.json(
        {
            success: false,
            message: "Unable to get current user",
        },
        { status: 500 }
        );
    }
}