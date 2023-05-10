import Link from "next/link";
import { IPost } from "src/Models/Post";
import { useEffect, useState } from "react";
import Header from "src/components/Header";
import { withAuthSync, logout } from "../../utils/auth";
import toast from "react-hot-toast";

const Usuarios = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [checks, setChecks] = useState<Boolean[]>([false]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    const asyncGetPosts = async () => {
      const { origin } = window.location;
      const data = await fetch(origin + "/api/posts");
      const posts = await data.json();
      return posts;
    };
    if (window) {
      asyncGetPosts()
        .then((posts) => {
          setPosts(posts);
          let tChecks: Boolean[] = new Array(posts.length);
          for (let i = 0; i < posts.length; i++) {
            tChecks[i] = false;
          }
          setChecks(tChecks);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onRemove = async (_id: string) => {
    const data = {
      id: _id,
    };
    try {
      const response = await fetch("/api/posts/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        getPosts();
      } else if (response.status === 409) {
        toast.error("Somthing went wrong");
      } else {
        toast.error("Somthing went wrong");
      }
    } catch (err) {
      toast.error("You have an error in your code or there are network issues");
    }
  };

  const onDelete = async () => {
    checks.map((val, key) => {
      if (val === true) {
        onRemove(posts[key]._id);
      }
    });
  };

  const onChangeCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setChecks((_checks) =>
      _checks.map((_check, _id) => (id === _id ? e.target.checked : _check))
    );
  };

  const mappedPosts = posts.map((post, i) => (
    <div
      className="p-4 rounded-md text-sm w-full sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/6 border-2 m-1 overflow-auto"
      key={i}
    >
      <div className="flex items-center justify-between">
        <b className="my-2">Title: {post.title}</b>
        <input
          type="checkbox"
          checked={checks[i] ? true : false}
          onChange={(e) => onChangeCheck(e, i)}
          className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
        />
      </div>
      <br />
      <p className="my-4">Content: {post.content}</p>
      <div className="flex space-x-2">
        <Link href={`/posts/edit/${post._id}`}>
          <button className="px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-teal-500">
            Edit
          </button>
        </Link>
        <button
          className="px-2 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-teal-500"
          onClick={() => onRemove(post._id)}
        >
          Remove
        </button>
      </div>
    </div>
  ));

  return (
    <div>
      <Header>Total Items: {posts.length}</Header>
      <div className="flex space-x-4">
        <div
          className="bg-gray-600 inline-block px-2 py-1 text-white cursor-pointer"
          onClick={logout}
        >
          Logout
        </div>
        <Link href="/posts/create">
          <div className="bg-blue-500 inline-block px-2 py-1 text-white cursor-pointer">
            Add one
          </div>
        </Link>
        <button
          className="bg-red-500 inline-block px-2 py-1 text-white cursor-pointer"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
      <div className="py-4 flex flex-wrap overflow-y-scroll h-auto my-4 border-4 rounded-md">
        {mappedPosts}
      </div>
    </div>
  );
};

export default withAuthSync(Usuarios);
