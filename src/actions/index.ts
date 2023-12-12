"use server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
export async function editSnippet(id: number, code: string) {
    console.log(id, code);
    await db.snippet.update({
        where: { id },
        data: { code },
    });
    // redirect(`/snippets/${id}`);
    revalidatePath(`/snippets/${id}`)
    redirect('/')
}

export async function deleteSnippet(id: number) {
    await db.snippet.delete({
        where: { id },
    });
    revalidatePath("/")
    redirect("/");
}

export async function createSnippet(
    formState: { message: string },
    formData: FormData
) {
    // // this needs to be a server action!
    // 'use server'
    // Check user inputs are valid
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !=='string' || title.length<3){
        return {
            message:'Title must be longer'
        };
    }
    if (typeof code !=='string' || code.length<10){
        return {
            message:'Code must be longer'
        };
    }
    
    //create a new record in database
    const snippet = await db.snippet.create({
        data: {
            title,
            code,
        },
    });
    // console.log(snippet)
    // redirect the user back to the root route
    revalidatePath("/")
    redirect("/");

    // return {
    //     message:'Title must be longer'
    // }
}
