import {SECRET_GITHUB_API_TOKEN} from "$env/static/private";

export const fetchGithubFolds = async () => {
    const headers = {
        'Authorization': `Bearer ${SECRET_GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    }

    const profileRes = await fetch('https://api.github.com/users/maksiksq', {headers: headers});
    const profileData = await profileRes.json();

    // kind of lame using someone's wrapper for this but scraping the ui response myself seems even less reliable
    // and their graphql api probably requires some extra setup
    const commitsRes = await fetch('https://github-contributions-api.jogruber.de/v4/maksiksq', {
        headers: headers
    });
    const commitsData = await commitsRes.json();
    const totalCommits = commitsData.contributions.length;

    let totalStars = 0;
    let page = 1;
    while (true) {
        const reposRes = await fetch(`https://api.github.com/users/maksiksq/repos?per_page=100&page=${page}`, {
            headers: headers
        });
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

export const fetchChaosAbyssdFolds= async () => {
    // TODO: CA api
}