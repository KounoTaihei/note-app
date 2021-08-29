import { Post, Thread } from "@prisma/client";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import { API_URL } from "../../environments/environments";

const apiUrl = API_URL + "/posts";

const Posts = ({ posts }: Props) => {
    return (
        <>
            {posts.map(post => <p key={post.id}>{post.title}</p>)}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    let posts: Post[];

    if(params?.threadId !== undefined) {
        const threadId = params.threadId.toString();
        posts = await axios.get(`${apiUrl}/${threadId}`)
    } else {
        posts = await axios.get(apiUrl).then(v => v.data);
    }

    return {
        props: { posts }
    }
}

interface Props {
    posts: Post[]
}

export default Posts;