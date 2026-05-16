import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const boat = await prisma.boat.findUnique({
		where: { id },
		select: { id: true, name: true, category: true, weightKg: true },
	});
	if (!boat) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(boat);
}
