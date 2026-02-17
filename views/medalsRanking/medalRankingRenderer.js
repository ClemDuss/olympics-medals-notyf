
document.addEventListener('DOMContentLoaded', function() {
    const medalsList = document.querySelector('.medals-list');
    const medalsItems = medalsList.querySelectorAll('.item');

    fetch('https://www.olympics.com/wmr-owg2026/competition/api/FRA/medals', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {

        data.medalStandings.medalsTable.forEach(country => {
            const countryItem = document.createElement('div');
            countryItem.classList.add('item');
            const totalMedals = country.medalsNumber.find(o => o.type === 'Total');
            countryItem.innerHTML = `
                <span class="rank">${country.rank}</span>
                <span class="country">
                    <img src="https://gstatic.olympics.com/s3/noc/oly/3x2/${country.organisation}.png" height="16" loading="lazy" alt="Drapeau - Norvège" title="Drapeau - Norvège" aria-hidden="false" class="css-kdlghf">
                    ${country.description}
                </span>
                <span class="gold">${totalMedals.gold}</span>
                <span class="silver">${totalMedals.silver}</span>
                <span class="bronze">${totalMedals.bronze}</span>
            `;

            if(country.organisation === 'FRA'){
                // Load medals list fro France
                let medalsDayByDay = [];
                let allMedals = []
                country.disciplines.forEach(someDiscipline => {
                    someDiscipline.medalWinners.forEach(someMedal => {
                        allMedals.push({
                            discipline: someDiscipline.name,
                            event: someMedal.eventDescription,
                            medalType: someMedal.medalType,
                            athlete: someMedal.competitorDisplayTvName,
                            date: someMedal.date,
                            disciplineCode: someDiscipline.code
                        })
                    })
                })
                allMedals.sort((a, b) => (a.discipline.localeCompare(b.discipline)));
                allMedals.sort((a, b) => new Date(b.date) - new Date(a.date));
                console.log(allMedals)

                let lastDateRendered = null;
                let lastDisciplineRendered = null;
                let dayList = null;
                
                const medalsDetailsContainer = document.querySelector('.medals-details>.details-list');

                allMedals.forEach(medal => {
                    const someMedalDetails = document.createElement('div');
                    someMedalDetails.classList.add('some-medal');

                    // Check if date changes to reset discipline header and add date separator
                    console.log(medal.date, lastDateRendered)
                    if(lastDateRendered !== medal.date){
                        const dateSeparator = document.createElement('div');
                        dateSeparator.classList.add('day-header');
                        if(medal.date == new Date().toISOString().split('T')[0]){
                            dateSeparator.innerHTML = `<span>Aujourd'hui - ${new Date(medal.date).toLocaleDateString()}</span>`;
                        } else {
                            dateSeparator.innerHTML = `<span>${new Date(medal.date).toLocaleDateString()}</span>`;
                        }
                        medalsDetailsContainer.appendChild(dateSeparator);
                        lastDateRendered = medal.date;
                        lastDisciplineRendered = null
                        dayList = document.createElement('div');
                        dayList.classList.add('day-list');
                        medalsDetailsContainer.appendChild(dayList);
                    }

                    // Check if discipline changes to add discipline separator
                    if(lastDisciplineRendered !== medal.discipline){
                        const disciplineSeparator = document.createElement('div');
                        disciplineSeparator.classList.add('discipline-name');
                        let disciplineIconUrl = `https://wmr-static-assets.scd.dgplatform.net/sm-cloudinary/Winter/Oly/Pictograms/SVG/Bold/${medal.disciplineCode.toLowerCase()}.svg`;
                        disciplineSeparator.innerHTML = `
                            <span class="icon" style="background-image: url(${disciplineIconUrl})"></span>
                            ${medal.discipline}`;
                        dayList.appendChild(disciplineSeparator);
                        lastDisciplineRendered = medal.discipline;
                    }

                    // get medal emoji
                    let medalEmoji = '🏅';

                    switch(medal.medalType){
                        case 'ME_GOLD':
                            medalEmoji = '🥇';
                            break;
                        case 'ME_SILVER':
                            medalEmoji = '🥈';
                            break;
                        case 'ME_BRONZE':
                            medalEmoji = '🥉';
                            break;
                    }

                    // Insert medal details in the container
                    someMedalDetails.innerHTML = `
                        <div class="medal-type">${medalEmoji}</div>
                        <div class="medal-informations">
                            <div class="athlete">${medal.athlete}</div>
                            <div class="event-description">${medal.event}</div>
                        </div>
                    `;
                    dayList.appendChild(someMedalDetails);

                })
            }

            medalsList.appendChild(countryItem);
        });
    });
});


document.querySelector('header .logo').addEventListener('click', ()=>{
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('displayed'));
})