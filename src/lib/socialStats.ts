import {SECRET_GITHUB_API_TOKEN} from "$env/static/private";

export const fetchGithubFoldData = async () => {
    const headers = {
        'Authorization': `Bearer ${SECRET_GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    }

    const profileRes = await fetch('https://api.github.com/users/maksiksq', {headers: headers});
    const profileData = await profileRes.json();

    // kind of lame using someone's wrapper for this but scraping the ui response myself seems even less reliable
    // and their graphql api probably requires some extra setup
    const commitsRes = await fetch('https://github-contributions-api.jogruber.de/v4/maksiksq', {headers});
    const commitsData = await commitsRes.json();
    const totalCommits = commitsData.contributions.length;

    let totalStars = 0;
    let page = 1;
    while (true) {
        const reposRes = await fetch(`https://api.github.com/users/maksiksq/repos?per_page=100&page=${page}`, {headers});
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
        github: "maksiksq",
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
    const handle = 'maksiks.bsky.social'

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
    const userId = 'U091PA9FBDG';

    const profileRes = await fetch(`https://hackatime.hackclub.com/api/summary?user=${userId}`, {headers});

    if (profileRes.ok) {
        const {projects, languages} = await profileRes.json();

        let time = 0;
        for (const project of projects) {
            time += project.total;
        }

        // rounding it up obviously
        // im so lame
        const timeHrs = Math.ceil(time / 3600);

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