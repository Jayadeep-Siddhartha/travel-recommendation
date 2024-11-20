document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.querySelector("#search-button");
    const clearButton = document.querySelector("#clear-button");
    const searchInput = document.querySelector("#search-input");
    const resultsContainer = document.querySelector("#results-container");

    // Function to fetch data from the JSON file
    async function fetchData() {
        try {
            const response = await fetch("travel_recommendation_api.json");
            if (!response.ok) throw new Error("Failed to fetch data");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            resultsContainer.innerHTML = "<p>Error fetching data. Please try again later.</p>";
        }
    }

    // Fetch data on page load
    let travelData = [];
    fetchData().then(data => {
        travelData = data || [];
    });

    // Function to filter results based on keyword
    function filterResults(keyword, data) {
        const lowerKeyword = keyword.toLowerCase();
        const recommendations = [];

        // Search through countries
        data.countries.forEach(country => {
            if (country.name.toLowerCase().includes(lowerKeyword)) {
                country.cities.forEach(city => {
                    recommendations.push({ 
                        ...city, 
                        category: "Country",
                        imageUrl: city.imageUrl || "https://via.placeholder.com/100"
                    });
                });
            }
        });

        // Search through cities
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(lowerKeyword)) {
                    recommendations.push({ 
                        ...city, 
                        category: "City", 
                        imageUrl: city.imageUrl || "https://via.placeholder.com/100"
                    });
                }
            });
        });

        // Search through beaches
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(lowerKeyword)) {
                recommendations.push({ 
                    ...beach, 
                    category: "Beach", 
                    imageUrl: beach.imageUrl || "https://via.placeholder.com/100"
                });
            }
        });

        // Search through temples
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(lowerKeyword)) {
                recommendations.push({ 
                    ...temple, 
                    category: "Temple", 
                    imageUrl: temple.imageUrl || "https://via.placeholder.com/100"
                });
            }
        });

        return recommendations;
    }

    // Function to display results
    function displayResults(results) {
        resultsContainer.innerHTML = ""; // Clear previous results
        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>No results found</p>";
            return;
        }

        results.forEach(item => {
            const imageSrc = item.imageUrl || "https://via.placeholder.com/150";
            const resultCard = document.createElement("div");
            resultCard.classList.add("result-card");
            resultCard.innerHTML = `
                <img src="${imageSrc}" alt="${item.name}" />
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p><strong>Category:</strong> ${item.category}</p>
                </div>
            `;
            resultsContainer.appendChild(resultCard);
        });
    }

    // Event listener for the Search button
    searchButton.addEventListener("click", () => {
        const keyword = searchInput.value.trim();
        if (!keyword) {
            alert("Please enter a keyword to search!");
            return;
        }
        const results = filterResults(keyword, travelData);
        displayResults(results);
    });

    // Event listener for the Clear button
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        resultsContainer.innerHTML = "";
    });
});
