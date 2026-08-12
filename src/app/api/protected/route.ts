import {NextResponse} from "next/server";
import{ auth} from "@/lib/auth";
import {hasRole} from "@/lib/authorization";

export async function GET(){
    const session = await auth();
    if(!session){
        return NextResponse.json({
            success: false,
            message: "Unauthourized",
        },
        {status: 401});
    }
    if(!hasRole(session.user.role, ["host"])){
        return NextResponse.json(
        {
            success: false,
            message: "Forbidden",
        },
        { status: 403 }
        );
    }
    return NextResponse.json(
        {
        success: true,
        message: "You can access this protected route",
        data: {
            user: session.user,
        },
        },
        { status: 200 }
    );
}