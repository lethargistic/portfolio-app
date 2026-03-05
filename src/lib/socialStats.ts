import {SECRET_GITHUB_API_TOKEN, SECRET_INSTAGRAM_API_TOKEN, SECRET_YOUTUBE_API_KEY} from "$env/static/private";

export const fetchGithubFoldData = async () => {
    const headers = {
        'Authorization': `Bearer ${SECRET_GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    }

    const profileRes = await fetch('https://api.github.com/users/lethargistic', {headers: headers});
    const profileData = await profileRes.json();

    // kind of lame using someone's wrapper for this but scraping the ui response myself seems even less reliable
    // and their graphql api probably requires some extra setup
    const commitsRes = await fetch('https://github-contributions-api.jogruber.de/v4/lethargistic', {headers});
    const commitsData = await commitsRes.json();
    const totalCommits = commitsData.contributions.length;

    let totalStars = 0;
    let page = 1;
    while (true) {
        const reposRes = await fetch(`https://api.github.com/users/lethargistic/repos?per_page=100&page=${page}`, {headers});
        const repos = await reposRes.json();

        if (!reposRes.ok || reposRes.status === 403 || reposRes.status === 429) {
            console.warn("Rate limited for repos, rip", reposRes.ok, reposRes.status);

            totalStars = 0;
            break;
        }

        if (repos.length == 0 || !repos.length) break;
        page++;
        totalStars += repos.reduce((sum: number, repo: typeof repos[number]) => sum + repo.stargazers_count, 0);
    }

    return {
        github: "lethargistic",
        commits: totalCommits,
        followed: profileData.followers,
        repos: profileData.public_repos,
        stars: totalStars,
    }
}

export const fetchChaosAbyssFoldData = async () => {
    const headers = { "Content-Type": "application/json" };

    const articleCountRes = await fetch('https://www.chaos-abyss.com/api/stats/article-count', {headers});
    const { count: articleCount } = await articleCountRes.json();
    const latestPostDateRes = await fetch('https://www.chaos-abyss.com/api/stats/latest-post-date', {headers});
    const { date: latestPostDate } = await latestPostDateRes.json();
    const latestPostHumanDate = new Date(latestPostDate).toLocaleDateString('en-US', {
        'month': 'short',
        'year': 'numeric',
        'timeZone': 'UTC'

    })
    const wordsWrittenRes = await fetch('https://www.chaos-abyss.com/api/stats/words-written', {headers});
    const { words: wordsWritten } = await wordsWrittenRes.json();

    return {
        chaos_abyss: 'Abyss',
        articles: articleCount,
        last_post: latestPostHumanDate,
        words: wordsWritten,
    }
}

export const fetchBlueskyFoldData = async () => {
    const headers = { "Content-Type": "application/json" };
    const handle = 'lethargistic.bsky.social'

    const profileRes = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`, {headers});

    if (profileRes.ok) {
        const { followersCount, postsCount, did: myDid } = await profileRes.json();

        let totalLikes = 0;
        let cursor;

        do {
            const url = new URLSearchParams({
                actor: handle,
                limit: '100'
            });
            if (cursor) url.set('cursor', cursor);

            const response = await fetch(
                `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?${url}`
            );

            const data = await response.json();

            for (const item of data.feed) {
                // reposts
                if (item.post.author.did !== myDid) {
                    continue;
                }

                totalLikes += item.post.likeCount || 0;
            }

            cursor = data.cursor;
        } while (cursor);

        return {
            bluesky: 'none',
            followed: followersCount,
            posts: postsCount,
            likes: totalLikes
        }
    } else {
        console.error(`Bluesky api error: ${profileRes.status}`);

        return {
            bluesky: 'none',
            followed: null,
            posts: null,
            likes: null
        }
    }
}

export const fetchHackatimeFoldData = async () => {
    const headers = { "Content-Type": "application/json" };
    const username = 'lethargistic';

    const profileRes = await fetch(`https://hackatime.hackclub.com/api/v1/users/${username}/stats`, {headers});

    if (profileRes.ok) {
        const json = await profileRes.json();
        const {total_seconds, languages} = json.data;

        const timeHrs = Math.floor(total_seconds / 3600);

        // hardcoded because no one needs to know about my java knowledge, bastards
        const svelteTime = languages.find((l: typeof languages[number]) => l.key === "Svelte")?.total;
        const svelteTimeHrs = svelteTime ? Math.ceil(svelteTime / 3600) : null;
        const tsTime = languages.find((l: typeof languages[number]) => l.key === "TypeScript")?.total;
        const tsTimeHrs = tsTime ? Math.ceil(tsTime / 3600) : null;

        return {
            hackatime: 'none',
            time: timeHrs,
            top_lang: svelteTimeHrs,
            second_top_lang: tsTimeHrs
        }
    } else {
        console.error(`Hackatime api error: ${profileRes.status}`);

        return {
            hackatime: 'none',
            time: null,
            top_lang: null,
            second_top_lang: null
        }
    }
}

// modern twitter api is a horror, i'm skipping
// tho the graphql one does expose follower count for free
// you do still need to find the right headers and that needs a guest key right,
// but, basically, no twitter

export const fetchInstagramFoldData = async () => {
    const id = "26227636330153415";

    const followedRes = await fetch(
        `https://graph.instagram.com/${id}?fields=followers_count&access_token=${SECRET_INSTAGRAM_API_TOKEN}`
    );

    if (followedRes.ok) {
        const json = await followedRes.json();
        return {
            followed: json.followers_count,
        }
    } else {
        console.error(`Instagram api error: ${followedRes.status}`);

        return {
            followed: null,
        }
    }
}

export const fetchNpmFoldData = async () => {
    const username = 'lethargistic';

    const packageRes = await fetch(
        `https://registry.npmjs.org/-/v1/search?text=author:${username}`
    );

    if (packageRes.ok) {
        const json = await packageRes.json();
        return {
            packages: json.objects.length,
        }
    } else {
        console.error(`Npm api error: ${packageRes.status}`);

        return {
            packages: null,
        }
    }
}

export const fetchStackOverflowFoldData = async () => {
    const id = "17208613";

    const reputationRes = await fetch(
        `https://stackoverflow.com/users/flair/${id}.json`
    );

    if (reputationRes.ok) {
        const json = await reputationRes.json();
        return {
            reputation: json.reputation
        }
    } else {
        console.error(`Stack overflow api error: ${reputationRes.status}`);

        return {
            reputation: null,
        }
    }
}

export const fetchYoutubeFoldData = async () => {
    const id = "UCtPK7NNErHRXL7pZk0VflLA";

    const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${SECRET_YOUTUBE_API_KEY}`
    );

    if (channelRes.ok) {
        const json = await channelRes.json();
        return {
            subscribers: json.items[0].statistics.subscriberCount
        }
    } else {
        console.error(`Youtube api error: ${channelRes.status}`);

        return {
            subscribers: null,
        }
    }
}
