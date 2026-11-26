export default async function handler(req, res) {
try {
const latitude = process.env.WEATHER_LAT;
const longitude = process.env.WEATHER_LON;

if (!latitude || !longitude) {
return res.status(500).json({
error: "Weather location not configured"
});
}

const url =
`https://api.open-meteo.com/v1/forecast` +
`?latitude=${latitude}` +
`&longitude=${longitude}` +
`&current=temperature_2m,weather_code`;

const response = await fetch(url);

if (!response.ok) {
throw new Error("Weather request failed");
}

const data = await response.json();

const code = data.current.weather_code;
const temperature = data.current.temperature_2m;

const weather = describeWeather(code);

res.setHeader(
"Cache-Control",
"s-maxage=600, stale-while-revalidate=300"
);

return res.status(200).json({
temperature,
label: weather.label,
icon: weather.icon
});

} catch (error) {
console.error(error);

return res.status(500).json({
error: "Weather unavailable"
});
}
}


function describeWeather(code) {
if (code === 0) {
return {
label: "clear",
icon: "☀"
};
}

if ([1, 2].includes(code)) {
return {
label: "partly cloudy",
icon: "☁"
};
}

if (code === 3) {
return {
label: "overcast",
icon: "☁"
};
}

if ([45, 48].includes(code)) {
return {
label: "foggy",
icon: "≋"
};
}

if ([51, 53, 55, 56, 57].includes(code)) {
return {
label: "drizzling",
icon: "☂"
};
}

if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
return {
label: "raining",
icon: "☂"
};
}

if ([71, 73, 75, 77, 85, 86].includes(code)) {
return {
label: "snowing",
icon: "❄"
};
}

if ([95, 96, 99].includes(code)) {
return {
label: "stormy",
icon: "⚡"
};
}

return {
label: "cloudy",
icon: "☁"
};
}
