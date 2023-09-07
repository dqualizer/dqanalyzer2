import dqLogo from '../assets/dqualizer_logo.png';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@mui/base';

import React from 'react'
import { Link, useLoaderData } from 'react-router-dom';

import werkstatt from '../data/werkstatt.json';

import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function loader() {
    const domains = await getDomains();
    return { domains }
}

export async function getDomains(query) {
    await fakeNetwork(`getDomains:${query}`);
    let domains = await localforage.getItem("domains");
    if (!domains) domains = [];
    if (query) {
        domains = matchSorter(domains, query, { keys: ["first", "last"] });
    }
    return domains.sort(sortBy("last", "createdAt"));
}


export async function getDomain(id) {
    await fakeNetwork(`domain:${id}`);
    let domains = await localforage.getItem("domains");
    let domain = domains.find(domain => domain.domainId === id);
    return domain ?? null;
}

export async function createDomain() {
    await fakeNetwork();

    const domain = werkstatt;

    let domains = [];
    domains.push(domain);
    await set(domains);
    return domain;
}

function set(domains) {
    return localforage.setItem("domains", domains);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
    if (!key) {
        fakeCache = {};
    }

    if (fakeCache[key]) {
        return;
    }

    fakeCache[key] = true;
    return new Promise(res => {
        setTimeout(res, Math.random() * 800);
    });
}

const POSTS = [
    { id: 1, title: "Post 1" },
    { id: 2, title: "Post 2" }
]

function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

export default function Home() {
    createDomain();

    const queryClient = useQueryClient();

    const postsQuery = useQuery({
        queryKey: ["post"],
        queryFn: () => wait(1000).then(() => [...POSTS])
    })

    const newPost = useMutation({
        mutationFn: (title) => {
            return wait(1000).then(() => POSTS.push({ id: crypto.randomUUID(), title }))
        },
        onSuccess: () => {
            queryClient.invalidateQueries("post");
        }
    })

    if (postsQuery.isLoading) return <h1>Loading...</h1>
    if (postsQuery.isError) return <pre>{JSON.stringify(postsQuery.error)}</pre>


    const { domains } = useLoaderData();

    return (
        <div class="flex items-center justify-center h-screen flex-col">
            {postsQuery.data.map(post => (<div key={post.id}>{post.title}</div>))}
            <Button className='btn' onClick={() => newPost.mutate("New Post")}>New Post</Button>
            <div class="text-center">
                <img src={dqLogo} alt="" srcset="" class="mx-auto mb-4 w-1/2" />
                <p class="font-bold text-2xl">Welcome to dqAnalyzer 1.0!</p>
                <p class="text-xl">First of all: Choose your Demo-Domain.</p>
            </div>
            <div className='flex gap-4 mt-5'>
                {domains.length ? (domains.map((domain) => (
                    <Link to={`/analyzer/${domain.domainId}`}>
                        <div className="w-60 h-60 border-2 border-cyan-400 relative hover:scale-110">
                            <img
                                src="http://localhost:5173/werkstatt.png"
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <span className="text-black text-l font-bold absolute bottom-0 left-0 right-0 text-center mb-2">
                                {domain.context}
                            </span>
                        </div>
                    </Link>
                ))) : <h3>No Domains</h3>}
            </div>
        </div>


    )
}