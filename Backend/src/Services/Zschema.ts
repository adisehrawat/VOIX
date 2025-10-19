import { email, z } from "zod"

export const SignupSchema = z.object({
  email: z.string(),
  password: z.string().min(8).optional(),
  name: z.string().min(3),
  imageUrl: z.string().optional(),
  authtype: z.enum(["Google", "Password",])
})


export const SiginSchema = z.object({
  email: z.string(),
  password: z.string()
})


export const CreateBuzz = z.object({
  content: z.string().min(10).optional(),
  image: z.string().optional(),
  user: z.object({
    email: z.string(),
    id: z.string(),
  }),
}).refine(
  (data) => data.content || data.image,
  {
    message: "Either content or image must be provided",
    path: ["content"],
  }
);


export const CreatComment = z.object({
  user: z.object({
    email: z.string(),
    id: z.string()
  }),
  content: z.string().min(10).optional(),
  image: z.string().optional(),
  parentBuzzId: z.string()
}).refine(
  (data) => data.content || data.image,
  {
    message: "Either content or image must be provided",
    path: ["content"],
  }
);



export const CreateVote = z.object({
  user: z.object({
    email: z.string(),
    id: z.string()
  }),
  postid: z.string(),
  type: z.enum(["UpVote", "DownVote"])
})



export const FriendRequested = z.object({
  user: z.object({
    email: z.string(),
    id: z.string()
  }),
  reciverid: z.string()
})


export const ApprovedFriendRequest = z.object({
  user: z.object({
    email: z.string(),
    id: z.string()
  }),

  senderid : z.string() 
})

export const RemoveFriendRequser = z.object({
  user : z.object({
    email : z.string() , 
    id : z.string() 
  }),
  friendid : z.string() 


})

export const AddLocationSchema = z.object({
    user : z.object({
    email : z.string() , 
    id : z.string() 
  }),
  longitude : z.string() , 
  latitude : z.string()
})


export const UpdateLocation = z.object({
      user : z.object({
    email : z.string() , 
    id : z.string() 
  }),
  longitude : z.string() , 
  latitude : z.string()
})