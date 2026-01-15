import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import { supabaseAdmin, UserDiagram } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { data: diagrams, error } = await supabaseAdmin
      .from('user_diagrams')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ diagrams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { title, sourceCode, diagramData } = await req.json();

    if (!title || !sourceCode || !diagramData) {
      return NextResponse.json(
        { error: "Title, source code, and diagram data are required" },
        { status: 400 }
      );
    }

    const diagramDataToInsert: Omit<UserDiagram, 'id' | 'created_at' | 'updated_at'> = {
      user_id: user.id,
      title,
      source_code: sourceCode,
      diagram_data: diagramData,
    };

    const { data: diagram, error } = await supabaseAdmin
      .from('user_diagrams')
      .insert(diagramDataToInsert)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ diagram });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}