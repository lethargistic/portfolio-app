export const fetchGithubStats = async () => {
    const profileRes = await fetch('https://api.github.com/users/maksiksq');
    const profileData = await profileRes.json();

    // kind of lame using someone's wrapper for this but scraping the ui response myself seems even less reliable
    // and their graphql api probably requires some extra setup
    const commitsRes = await fetch('https://github-contributions-api.jogruber.de/v4/maksiksq');
    const commitsData = await commitsRes.json();
    const totalCommits = commitsData.contributions.length;

    return {
        github: "maksiksq",
        commits: totalCommits,
        followed: profileData.followers,
        repos: profileData.public_repos,
        stars: profileData.followers
    }

}