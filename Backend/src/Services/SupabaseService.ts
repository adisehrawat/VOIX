import { createClient } from '@supabase/supabase-js'

const anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZ3Zkc3B0bXN4aHhoZG1icGZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MzUzMjYsImV4cCI6MjA3NjMxMTMyNn0.u1NlNLzgcHr5vvbKTW945U5NyWhBdybLv09f8MOFblo"
// Create a single supabase client for interacting with your database
const Supabase = createClient('https://wpgvdsptmsxhxhdmbpff.supabase.co', anon_key)



export class SupabaseService {


    static async getBuzzbyId(id: string) {
        const { data, error } = await Supabase.from('Buzz').select(`*,
            user:User(id , Name ,ImageUrl , email , public_key),
            Vote(userid , type),
            Tip(id , amount , symbol , Sender:User(Name , ImageUrl)) , 
            parentBuzz:Buzz(id , content , user:User(Name , ImageUrl)) 
            `).eq('id', id).single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }


    static async getUserProfile(id: string) {
        const { data, error } = await Supabase.from('User').select('id , Name , ImageUrl , email , public_key , createdAt , karma:Karma(points , nfts)  , Friends:Friend(id) , buzz:Buzz(id)').eq('id', id).single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

}