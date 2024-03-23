"use server";

import { redirect } from "next/navigation";

export default async function signupAction(
  currentState,
  formData
) {
  // Get the data off the form
  const student_name = formData.get("student_name");
  const grade = formData.get("grade");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const address = formData.get("address");
  const password = formData.get("password");

  //  Send to our api route
  const res = await fetch(process.env.ROOT_URL + "/api/user/add-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      student_name : student_name,
      grade: grade,
      email: email,
      phone: phone,
      address: address,
      password: password}),
  });

  const json = await res.json();

  // Redirect to login if success
  if (res.ok) {
    redirect("/login");
  } else {
    return json.error;
  }
}