import cheerio from 'cheerio';
import axios from 'axios';

// HTTP POST FUNCTION для получения необходимых 'cookie'
export async function postHttp(url, body) {
    const postToSchoolSiteForCookie = await axios.post(url, body);
    const cookieForLogIn = postToSchoolSiteForCookie.headers['set-cookie']; // забираем cookie из http заголовка

    return cookieForLogIn;
};

// HTTP GET FUNCTION
export async function parseSchoolWeekPage(url, cookieForLogIn) {
    const getHTMLPage = await axios.get(url, { // получение html странички
        headers: {
            Cookie: cookieForLogIn
        }
    });
    const processedPage = cheerio.load(getHTMLPage.data);// передаём обработанную старничку в одну переменную 'processedPage'

    return processedPage;
};

export function formLessonsInfo(processedPage, optionsToGetElement) {
    const allLessons = []; // массив для уроков

    let Понедельник = [];
    let Вторник = [];
    let Среда = [];
    let Четверг = [];
    let Пятница = [];
    let Суббота = [];

    const allLessonsInfoWithWeekDays = { Понедельник, Вторник, Среда, Четверг, Пятница, Суббота }; // массив для распределения уроков по дням
    let dayIndexNum = 0; // Индекс дня в объекте

    const lessonNumber = getArrayByOptionElement(processedPage, optionsToGetElement.optionLessonNumber); // получаем массив данных для числа
    const lessonsNames = getArrayByOptionElement(processedPage, optionsToGetElement.optionLessonName); // получаем массив данных для имени
    const lessonTime = getArrayByOptionElement(processedPage, optionsToGetElement.optionLessonTime); // получаем массив данных для времени

    for (let i = 0; i < lessonsNames.length; i++) { // создаём объект, взяв одинаковые записи у всех массивов, и передаём его в массив. Получаем массив с объектами.
        if (Number(lessonNumber[i]) !== 0) {
            const lessonInfo = makeNewLessonObj(lessonNumber[i], lessonsNames[i], lessonTime[i]);
            allLessons.push(lessonInfo);
        }
    }

    for (let i = 0; i < allLessons.length - 1; i++) { // распределение уроков по дням
        allLessonsInfoWithWeekDays[Object.keys(allLessonsInfoWithWeekDays)[dayIndexNum]][i] = allLessons[i];

        // (нахождение названия ключа по индексу, ссылаемся на несуществующий ключ объекта, чтобы его создать и добавляем туда урок) добавление урока в определенный день в объекте
        if (Number(allLessons[i]['lessonNumber']) >= Number(allLessons[i + 1]['lessonNumber'])) { // если следующий урок меньше/равень настоящему, то значит он будет на следующий день, поэтому увеличиваем индекс дня на 1
            dayIndexNum++;
        }
    }

    for (let y = 1; y < 5; y++) { // очистка от undefined
        while (allLessonsInfoWithWeekDays[Object.keys(allLessonsInfoWithWeekDays)[y]][0] === undefined) {
            allLessonsInfoWithWeekDays[Object.keys(allLessonsInfoWithWeekDays)[y]].splice(0, 1);
        }
    }

    return allLessonsInfoWithWeekDays;
}

function makeNewLessonObj(lessonNumber, lessonName, lessonTime) { // создаём объект для одного предмета
    lessonNumber = lessonNumber.trim(); // мы получаем неправильную строку, например, '\n       8', поэтому убираем всё лишнее, оставляя только число

    return {
        lessonNumber,
        lessonName,
        lessonTime
    };
}

function getArrayByOptionElement(processedPage, optionsToGetElementToArray) { // создаём и выводим массив данных на основе предоставленных параметров(номер/имя/время)
    return processedPage(optionsToGetElementToArray).map(
        function () {
            return processedPage(this).text();
        }).toArray();
}
