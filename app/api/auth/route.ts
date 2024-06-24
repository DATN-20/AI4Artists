export async function POST(request: Request){
  const res = await request.json();
  const sessionToken = res?.access_token
  if(!sessionToken){
    return Response.json({message: "Token is not found!"},{
      status:400,
    })
  }
  return Response.json({res},{
    status: 200,
    headers: {
      'Set-Cookie': `token=${sessionToken}`
    }
  })
}
