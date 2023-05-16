import fs from 'fs'
import inquirer from 'inquirer'
import puppeteer from 'puppeteer'

//Metemos una variable global para introducir una palabra que vamos a buscar en la pagina a la que accedamos (Game en este caso).


const scrapping = async (keyWord) =>{
    //En esta variable introducimos la url donde haremos el scrapping
    const BASE_URL ='https://www.game.es/'

    //Aqui abrimos el browser y ponemos que se maximice. 
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'],
    })

    //Abrimos la pagina
    const page = await browser.newPage();

    //Aqui le metemos la url a la pagina del navegador
    await page.goto(BASE_URL);

    //Aqui usamos un await para darle click al input de busqueda de la página. Entre parentesís ponemos el id de donde ponemos el input para buscar por buscador.
    await page.click("#searchinput")
    
    //Aqui introduciremos la keyWord (Lo que nosotros especifiquemos que sea buscado) en el input del buscador
    await page.type("#searchinput", keyWord)

    //Aquí le diremos al script que presione enter para realizar la busqueda.
    await page.keyboard.press("Enter");

    //Esperamos 8 segundos
    await page.waitForTimeout(8000);

    
    //Aquí mandamos al script que haga scroll hacia abajo. El codigo basico es todo lo que hay dentro del siguiente await page.evaluate, y cuantas veces copies y pegues hacia abajo este codigo, más scroll hará el script.
    await page.evaluate(() =>{
        const element = document.getElementById("l-footer");
        const y = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: y })
    })

    await page.evaluate(() =>{
        const element = document.getElementById("l-footer");
        const y = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: y })
    })

    await page.evaluate(() =>{
        const element = document.getElementById("l-footer");
        const y = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: y })
    })

    await page.evaluate(() =>{
        const element = document.getElementById("l-footer");
        const y = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: y })
    })

    //Ahora guardamos lo datos que hemos recorrido. Aqui apuntaremos a cada item
    const items = await page.$$eval("div.search-item", (nodes)=> 
    nodes.map((n)=>({
        //A continuacion pedimos creamos un objeto donde especificamos que información queremos que el script nos saque de la web. Tendremos que especificar dentro de los parentesis del queryselector a donde exactamente
        //el .innerText o .src que hay al final de cada linea corresponde a las propiedades de cada tipo de información. Para saber que poner en cada ocasion tienes que mirar en propiedades al inspeccionar la pagina.
        //El '?' se llama optional chaining, es para que el script continue se cumplan o no esos requisitos. 
        title: n.querySelector("a.cm-txt")?.innerText,
        image: n.querySelector(".img-responsive")?.src,
        price: n.querySelector("div.buy--price")?.innerText,
        type: n.querySelector("span.cm-text")?.innerText,
    }))

    );
    items.pop();

    await browser.close();

    //Aqui convertimos la informacion en un string
    const dataString = JSON.stringify(items)
    
    //Aqui convertimos la info a texto plano
    fs.writeFile(
        `${keyWord.replace(" ", "").toLowerCase()}.json`, 
        dataString, ()=>{
        console.log("Archivo escrito!")
    }
    );
};

inquirer.prompt([
    {
        name: "busqueda",
        message: "Bienvenido a WebScrapper 3000. ¿Que página quieres consultar?"
    }
]).then((answers)=> {
   let keyWord = answers.busqueda;
    scrapping(keyWord);
})
//Para ejecutar: en terminal, 'npm run start'