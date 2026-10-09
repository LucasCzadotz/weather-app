const form = document.querySelector(".busca");
const input = form.querySelector("input");
const mensagem = document.querySelector(".mensagem");
const card = document.querySelector(".cardClima");

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const cidade = input.value.trim();
    if (!cidade) return;
    
    const cidadeSemAcento = cidade.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    mensagem.textContent = "Buscando...";
    card.hidden = true;

    try {
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${CHAVE}&q=${encodeURIComponent(cidadeSemAcento)}&lang=pt`);

        if (!res.ok) {
            throw new Error("Cidade não encontrada! :( ");
        }

        const dados = await res.json();
        mostrarClima(dados);
        mensagem.textContent = "";
        card.hidden = false;

    } catch (erro) {
        if (erro instanceof TypeError) {
            mensagem.textContent = "Sem conexão com a internet.";
        } else {
            mensagem.textContent = erro.message;
        }
    }
});


function mostrarClima(dados) {
    const { location, current } = dados;

    const [data, hora] = location.localtime.split(" ");
    const [ano, mes, dia] = data.split("-");

    document.querySelector("#cidade").textContent = location.name;
    document.querySelector("#local").textContent = `${location.region}, ${location.country}`;

    const tempo = document.querySelector("#dataHora");
    tempo.textContent = `${dia.padStart(2, "0")}/${mes}/${ano} ${hora}`;
    tempo.dateTime = `${data}T${hora}`;

    const icone = document.querySelector("#iconeResultado");
    icone.src = `https:${current.condition.icon}`;
    icone.alt = current.condition.text;

    document.querySelector("#temperatura").textContent = `${Math.round(current.temp_c)}°`;
    document.querySelector("#condicao").textContent = current.condition.text;
    document.querySelector("#sensacao").textContent = `${Math.round(current.feelslike_c)}°`;
    document.querySelector("#umidade").textContent = `${current.humidity}%`;
    document.querySelector("#vento").textContent = `${Math.round(current.wind_kph)} km/h`;
}