import React, { useState, useEffect } from 'react';
import './App.css';

const Header = () => (
    <header className="header">
        <h1>Welcome to our wildlife website</h1>
    </header>
);

const Navbar = () => (
    <nav className="nav">
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Our team</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">Blog</a></li>
        </ul>
        <form className="search">
            <label htmlFor="search-input" className="visually-hidden">Search query</label>
            <input type="search" name="q" id="search-input" placeholder="Search query" />
            <input type="submit" value="Go!" />
        </form>
    </nav>
);

const Article = () => (
    <article>
        <h2>The trouble with Bears</h2>
        <p>By Evan Wild</p>
        <p>
            Tall, lumbering, angry, dangerous. The real live bears of this world are proud, independent creatures, self-serving and always on the hunt for food. Nothing like the bears you see on TV, like Baloo from renowned documentary, <em>The Jungle Book</em>.
        </p>
        <p>
            So what are bears really like, and why does the world's media portray them with such a skewed vision? In this article we try to answer those questions, and give you a real insight into the life of the bear.
        </p>
        <h3>Types of bear</h3>
        <p>
            Bears come in two varieties — large and medium. You don't get small bears. If you have seen a small bear, then it was in fact probably a baby bear (cub) from another species.
        </p>
        <p>
            Bears can also be classified in terms of their habitat — both large and medium bears are just as at home in urban areas as they are in the countryside. Different habitats encourage different behaviour however, as you'll find out below.
        </p>
    </article>
);

const BearTable = () => (
    <section>
        <h2>Bear Types and Characteristics</h2>
        <table className="bear-table">
            <thead>
            <tr>
                <th>Bear Type</th>
                <th>Coat</th>
                <th>Adult Size</th>
                <th>Habitat</th>
                <th>Lifespan</th>
                <th>Diet</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Polar Bear</td>
                <td>White</td>
                <td>Large</td>
                <td>Arctic</td>
                <td>25 years</td>
                <td>Carnivore</td>
            </tr>
            <tr>
                <td>Grizzly Bear</td>
                <td>Brown</td>
                <td>Large</td>
                <td>Forests</td>
                <td>20 years</td>
                <td>Omnivore</td>
            </tr>
            <tr>
                <td>Panda Bear</td>
                <td>Black and White</td>
                <td>Medium</td>
                <td>Bamboo Forests</td>
                <td>20 years</td>
                <td>Herbivore</td>
            </tr>
            </tbody>
        </table>
    </section>
);

const Sidebar = () => (
    <aside className="sidebar">
        <h2>Related</h2>
        <ul>
            <li><a href="#">The trouble with Bees</a></li>
            <li><a href="#">The trouble with Otters</a></li>
            <li><a href="#">The trouble with Penguins</a></li>
            <li><a href="#">The trouble with Octopi</a></li>
            <li><a href="#">The trouble with Lemurs</a></li>
        </ul>
    </aside>
);

const App = () => {
    const [bears, setBears] = useState([]);

    useEffect(() => {
        const fetchImageUrl = async (fileName) => {
            const baseUrl = "https://en.wikipedia.org/w/api.php";
            const imageParams = {
                action: "query",
                titles: `File:${fileName}`,
                prop: "imageinfo",
                iiprop: "url",
                format: "json",
                origin: "*"
            };
            const url = `${baseUrl}?${new URLSearchParams(imageParams).toString()}`;
            const response = await fetch(url);
            const data = await response.json();
            const pages = data.query.pages;
            const imageUrl = Object.values(pages)[0].imageinfo[0].url;
            return imageUrl;
        };

        const fetchBearData = async () => {
            const baseUrl = "https://en.wikipedia.org/w/api.php";
            const params = {
                action: "parse",
                page: "List_of_ursids",
                prop: "wikitext",
                section: 3,
                format: "json",
                origin: "*"
            };

            const url = `${baseUrl}?${new URLSearchParams(params).toString()}`;
            const response = await fetch(url);
            const data = await response.json();
            const wikitext = data.parse.wikitext['*'];

            const speciesTables = wikitext.split('{{Species table/end}}');
            const bearsData = [];

            for (const table of speciesTables) {
                const rows = table.split('{{Species table/row');
                for (const row of rows) {
                    const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
                    const binomialMatch = row.match(/\|binomial=(.*?)\n/);
                    const imageMatch = row.match(/\|image=(.*?)\n/);

                    if (nameMatch && binomialMatch && imageMatch) {
                        const fileName = imageMatch[1].trim().replace('File:', '');
                        const imageUrl = await fetchImageUrl(fileName);

                        bearsData.push({
                            name: nameMatch[1],
                            binomial: binomialMatch[1],
                            image: imageUrl,
                            range: "Range information not available"
                        });
                    }
                }
            }

            setBears(bearsData);
        };

        fetchBearData();
    }, []);

    return (
        <div className="app-container">
            <Header />
            <Navbar />
            <main>
                <div className="main-content">
                    <Article />
                    <BearTable />
                </div>
                <Sidebar />
                <section className="bears-container">
                    <h2>Bear Species</h2>
                    {bears.length > 0 ? (
                        bears.map((bear, index) => (
                            <div key={index} className="bear-card">
                                <h3>{bear.name} ({bear.binomial})</h3>
                                <img src={bear.image} alt={bear.name} style={{ width: '200px', height: 'auto' }} />
                                <p><strong>Range:</strong> {bear.range}</p>
                            </div>
                        ))
                    ) : (
                        <p>Loading bear data...</p>
                    )}
                </section>
            </main>
            <footer>
                <p>&copy; 2025 Bear Encyclopedia. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;
