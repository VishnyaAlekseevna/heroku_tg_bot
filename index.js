const TelegramBot= require('node-telegram-bot-api')
const request= require('request')
const TOKEN = '587766662:AAGawG5uZwX7XQ8HhzXGwwIWY2WRTtxlzMU'

const bot =new TelegramBot (TOKEN, {
    polling: true
})

const KB= {
    currency:`Курс валюты`,
    picture: `Динамика курса`,
    Max: `Макс.`,
    Fivelet:`5 лет`,
    back: `Назад`
}



bot.onText(/\/start/, msg => {
    sendGreeting(msg)
})

bot.on('message', msg =>{
    switch (msg.text){
        case KB.picture:
            sendPictureScreen(msg.chat.id)
            break
        case KB.currency:
            sendCurrencyScreen(msg.chat.id)
        break
        case KB.back:
            sendGreeting(msg, false)
            break
        case KB.Max:
        case KB.Fivelet:
             break
    }
})

bot.on('callback_query', query => {
    //console.log(JSON.stringify(query, null, 2))
    const base = query.data
    const symbol = 'RUB'

    bot.answerCallbackQuery({
        callback_query_id: query.id,
        text:`Вы выбрали ${base}`
    })

    request(`http://api.fixer.io/latest?symbols=${symbol}&base=${base}`, (error, response, body) =>{

        if (error) throw new Error (error)

        if (response.statusCode === 200) {
            const currencyData = JSON.parse(body)

            const html =`<b>1 ${base}</b> - <em> ${currencyData.rates[symbol]} ${symbol}</em>`

           bot.sendMessage(query.message.chat.id, html, {
               parse_mode:'HTML'
           })
        }
    })


})

function sendPictureScreen(chatId) {
    bot.sendMessage(chatId, `Выберите период:`, {
        reply_markup: {
            keyboard: [
                [KB.Max, KB.Fivelet],
                [KB.back]
            ]
        }
    })
}
function sendGreeting(msg, sayHello=true) {
    const text = sayHello
        ?`Приветствую, ${msg.from.first_name}\nЧто вы хотите сделать?`
        : `Что вы хотите сделать?`

    bot.sendMessage(msg.chat.id, text, {
        reply_markup:{
            keyboard:[
                [KB.currency, KB.picture]
            ]
        }
    })
}

function sendCurrencyScreen(chatId) {

    bot.sendMessage(chatId, `Выберите тип валюты:`, {
        reply_markup: {
            inline_keyboard:[
                [
                    {
                        text:'Доллар',
                        callback_data:'USD'
                    }
                ],
                [   {
                        text: 'Евро',
                        callback_data: 'EUR'
                    }
                ]
            ]
        }
    })
}
