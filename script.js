const constants = {
    beer: { perPerson: 1.5, bottleSize: 12, pricePerLiter: 7.4 },
    wine: { perPerson: 0.4, bottleSize: 10, pricePerLiter: 13 },
    vodka: { perPerson: 0.3, bottleSize: 1, pricePerLiter: 70 },
    gin: { perPerson: 0.2, bottleSize: 1, pricePerLiter: 84 },
    frizz: { perPerson: 0.1, bottleSize: 0.7, pricePerLiter: 32 },
    rum: { perPerson: 0.03, bottleSize: 0.7, pricePerLiter: 98 },
    cranberry: { perPerson: 0.6, bottleSize: 1, pricePerLiter: 9.5 },
    oranj: { perPerson: 0.2, bottleSize: 1, pricePerLiter: 8.5 },
    tonic: { perPerson: 0.6, bottleSize: 1.5, pricePerLiter: 4.8 },
    cola: { perPerson: 0.5, bottleSize: 2.5, pricePerLiter: 3.2 },
    sprite: { perPerson: 0.5, bottleSize: 1.25, pricePerLiter: 4.8 },
    menerala: { perPerson: 1, bottleSize: 12, pricePerLiter: 1.5 }
};

let currentValues = JSON.parse(JSON.stringify(constants));

function calculate() {
    const resultTableBody = document.querySelector('#resultTable tbody');
    resultTableBody.innerHTML = '';

    const numPeople = parseInt(document.getElementById('numPeople').value) || 1;
    const drinks = Object.keys(currentValues).map(key => ({ name: key.charAt(0).toUpperCase() + key.slice(1), key, ...currentValues[key] }));

    let totalCost = 0;

    drinks.forEach(drink => {
        const inputId = `${drink.key}-per-person`;
        const inputElement = document.getElementById(inputId);
        const perPerson = inputElement ? parseFloat(inputElement.value) : drink.perPerson;
        currentValues[drink.key].perPerson = perPerson;

        const idealLiters = numPeople * perPerson;
        const roundedLiters = Math.ceil(idealLiters / drink.bottleSize) * drink.bottleSize;
        const cost = roundedLiters * drink.pricePerLiter;
        totalCost += cost;

        const row = `
            <tr>
                <td>${drink.name}</td>
                <td><input type="number" id="${inputId}" value="${perPerson}" step="0.1" onchange="handleInputChange('${drink.key}', this.value)"></td>
                <td>${roundedLiters}</td>
                <td>${cost.toFixed(2)}</td>
            </tr>
        `;
        resultTableBody.innerHTML += row;
    });

    const perPersonCost = (totalCost / numPeople).toFixed(2);

    const summaryRow = `
        <tr>
            <td colspan="3" style="text-align: right; font-weight: bold;">Total Cost</td>
            <td style="font-weight: bold;">${totalCost.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: right; font-weight: bold;">Cost Per Person</td>
            <td style="font-weight: bold;">${perPersonCost}</td>
        </tr>
    `;
    resultTableBody.innerHTML += summaryRow;
}

function handleInputChange(key, value) {
    currentValues[key].perPerson = parseFloat(value) || constants[key].perPerson;
    calculate();
}

function generateAsciiTable() {
    const numPeople = parseInt(document.getElementById('numPeople').value) || 1;
    const drinks = Object.keys(currentValues).map(key => ({ name: key.charAt(0).toUpperCase() + key.slice(1), key, ...currentValues[key] }));

    let table = '+----------------+-------------+---------------+-------+\n';
    table += '| Drink          | Per Person  | Rounded Liters | Cost  |\n';
    table += '+----------------+-------------+---------------+-------+\n';

    let totalCost = 0;

    drinks.forEach(drink => {
        const perPerson = currentValues[drink.key].perPerson;
        const idealLiters = numPeople * perPerson;
        const roundedLiters = Math.ceil(idealLiters / drink.bottleSize) * drink.bottleSize;
        const cost = roundedLiters * drink.pricePerLiter;
        totalCost += cost;

        table += `| ${drink.name.padEnd(15)} | ${perPerson.toFixed(1).padStart(11)} | ${roundedLiters.toString().padStart(13)} | ${cost.toFixed(2).padStart(5)} |\n`;
    });

    const perPersonCost = (totalCost / numPeople).toFixed(2);

    table += '+----------------+-------------+---------------+-------+\n';
    table += `| Total Cost      |             |               | ${totalCost.toFixed(2).padStart(5)} |\n`;
    table += `| Cost Per Person |             |               | ${perPersonCost.padStart(5)} |\n`;
    table += '+----------------+-------------+---------------+-------+\n';

    const textArea = document.createElement('textarea');
    textArea.value = table;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    alert('ASCII table copied to clipboard!');
}

// Initial calculation
calculate();
