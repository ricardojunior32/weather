new Promise(async (resolve) => {
    //minify da unificação ;)
    let chatbotCallback = '';let token = '';let conversationId = '';let identifiers = '';let stepCallback = {};let quebraDeLinha = '';let negritoComeco = '';let negritoFim = '';let temp = {};const initCallback=async()=>{try{bubble&&bubble.identifiers&&(chatbotCallback="WhatsApp")}catch(t){}try{facebookInteraction&&facebookInteraction.identifiers&&(chatbotCallback="Facebook")}catch(t){}"WhatsApp"===chatbotCallback?(identifiers=bubble.identifiers,stepCallback=chatbot.it[index],token=chatbot.tk,conversationId=bubble.conversationId.toString(),quebraDeLinha="\n",negritoComeco="*",negritoFim="*",bubble.temp&&(temp=bubble.temp)):"Facebook"===chatbotCallback?(identifiers=facebookInteraction.identifiers,stepCallback=bot.it[control],token=bot.tk,conversationId=facebookInteraction.conversationId.toString(),quebraDeLinha="\n",facebookInteraction.temp&&(temp=facebookInteraction.temp)):(identifiers=this.page.identifiers,stepCallback=next.data,token=this.token,conversationId=this.$store.state.data.conversationId.toString(),quebraDeLinha="<br>",negritoComeco="<b>",negritoFim="</b>",this.temp&&(temp=this.temp))},findIdentifier=async t=>{for(let e=identifiers.length-1;e>=0;e--){if(identifiers[e].label===t&&""!==identifiers[e].value)return identifiers[e].value;if(0===e)return""}},apiRequest=async(t,e,a,i)=>"WhatsApp"===chatbotCallback||"Facebook"===chatbotCallback?axios.post("https://integrations.globalbot.ai/integrations/integrador",{token:token,conversationId:conversationId,options:{method:t,link:e,data:a,config:i}}):this.$axios.post("https://api.panel.globalbot.ai/integrations/integrador",{token:token,conversationId:conversationId,options:{method:t,link:e,data:a,config:i}}),finishCallback=async()=>{"WhatsApp"===chatbotCallback?(chatbot.it[index]=stepCallback,bubble.identifiers=identifiers,await Bubble.updateOne({_id:bubble._id},{$set:{temp:temp}}),await this.flow(chatbot,bubble,index,obj)):"Facebook"===chatbotCallback?(await this.updateTemp(facebookId,facebookInteraction.pageId,{conversationId:facebookInteraction.conversationId,temp:temp}),bot.it[control]=stepCallback,facebookInteraction.identifiers=identifiers):(this.temp=temp,next.data=stepCallback,this.page.identifiers=identifiers)};
    //fim do minify da unificação
    await initCallback()
    let saltoErro = 0;
    let saltoSucesso = stepCallback.marker+1
    let jumpEncerrar
    try {
        //começo do código externo
        const city = await findIdentifier('cidade_clima')

        //Floripa
        const apiReq = await apiRequest('GET', 'https://dataservice.accuweather.com/forecasts/v1/daily/1day/35952?apikey=wcXAa7gKn2E0cXklogp1jEJ1XCWUdDT5&language=pt-BR')

        let text = apiReq.data['Headline']['Text']
        let severity = apiReq.data['Headline']['Severity']
        let category = apiReq.data['Headline']['Category']
        let link = apiReq.data['Headline']['Link']
        let tempMaxFlpFahr = apiReq.data['DailyForecasts']['0']['Temperature']['Maximum']['Value']
        let tempMinFlpFahr = apiReq.data['DailyForecasts']['0']['Temperature']['Minimum']['Value']

        //Belém
        const apiReqBel = await apiRequest('GET','https://dataservice.accuweather.com/forecasts/v1/daily/1day/44857?apikey=wcXAa7gKn2E0cXklogp1jEJ1XCWUdDT5&language=pt-BR')

        let textBel = apiReqBel.data['Headline']['Text']
        let severityBel = apiReqBel.data['Headline']['Severity']
        let categoryBel = apiReqBel.data['Headline']['Category']
        let linkBel = apiReqBel.data['Headline']['Link']
        let tempMaxBelFahr = apiReqBel.data['DailyForecasts']['0']['Temperature']['Maximum']['Value']
        let tempMinBelFahr = apiReqBel.data['DailyForecasts']['0']['Temperature']['Minimum']['Value']


        //Floripa CB
        if (city === 'Clima Floripa'){
            let tempMaxFlpCel = (tempMaxFlpFahr - 32) * (5/9)
            let tempMinFlpCel = (tempMinFlpFahr - 32) * (5/9)
            let texto = 'A previsão para Florianópolis é de ' + category + '<br>' + 'Com máxima de ' + tempMaxFlpCel.toFixed(0) + '°C' +'<br>' + 'E mínima de ' + tempMinFlpCel.toFixed(0) + '°C' +'<br><br>' + 'Para mais informações acesse: ' + link

            if( category == 'rain'){
                category = 'chuva'
                 texto = 'A previsão para Florianópolis é de ' + category + '<br>' + 'Com máxima de ' + tempMaxFlpCel.toFixed(0) + '°C' +'<br>' + 'E mínima de ' + tempMinFlpCel.toFixed(0) + '°C' + '<br>' +'Não esqueça seu guarda-chuva, ein?!' + '<br><br>' + 'Para mais informações acesse: ' + link
            }
            if( category == 'cold'){
                category = 'frio'
            }
            if( category == 'hot'){
                category = 'calor'
            }
            if( category == 'wind'){
                category = 'ventania'
            }
            if( category == 'frost'){
                category = 'geada'
            }
            if( category == 'sun'){
                category = 'dia ensolarado'
            }
            if( category == 'thunderstorm'){
                category = 'trovoada'
            }

            stepCallback.pergunta = texto
            stepCallback.next= 10

            console.log(apiReq)
        }

        //Belém CB
        if (city === 'Clima Belem'){
            let tempMaxBelCel = (tempMaxBelFahr - 32) * (5/9)
            let tempMinBelCel = (tempMinBelFahr - 32) * (5/9)
            let textoBel = 'A previsão para Belém é de' + categoryBel +  '<br>' + 'Com máxima de ' + tempMaxBelCel.toFixed(0) + '°C' + '<br>' + 'E mínima de ' + tempMinBelCel.toFixed(0) + '°C' +'<br><br>' + 'Para mais informações acesse: ' + linkBel

            if( categoryBel == 'rain'){
                categoryBel = 'chuva'
                textoBel = 'A previsão para Belém é de ' + categoryBel +  '<br>' + 'Com máxima de ' + tempMaxBelCel.toFixed(0) + '°C' + '<br>' + 'E mínima de ' + tempMinBelCel.toFixed(0) + '°C' + '<br>' +'Não esqueça seu guarda-chuva, ein?!' + '<br><br>' + 'Para mais informações acesse: ' + linkBel
            }
            if( categoryBel == 'cold'){
                categoryBel = 'frio'
            }
            if( categoryBel == 'hot'){
                categoryBel = 'calor'
                textoBel = 'A previsão para Belém é de' + categoryBel + '<br>' + 'Com máxima de ' + tempMaxBelCel.toFixed(0) + '°C' +'<br>' + 'E mínima de ' + tempMinBelCel.toFixed(0) + '°C' + 'Nada fora do normal, né?! Ta sempre quente 🥵' +'<br><br>' + 'Para mais informações acesse: ' + linkBel
            }
            if( categoryBel == 'wind'){
                categoryBel = 'ventania'
            }
            if( categoryBel == 'frost'){
                categoryBel = 'geada'
            }
            if( categoryBel == 'sun'){
                categoryBel = 'dia ensolarado'
                textoBel = 'A previsão para Belém é de' + categoryBel + '<br>' + 'Com máxima de ' + tempMaxBelCel.toFixed(0) + '°C' +'<br>' + 'E mínima de ' + tempMinBelCel.toFixed(0) + '°C' + 'Nada fora do normal, né?! Ta sempre quente 🥵' +'<br><br>' + 'Para mais informações acesse: ' + linkBel
            }
            if( categoryBel == 'thunderstorm'){
                categoryBel = 'trovoada'
            }

            stepCallback.pergunta = textoBel
            stepCallback.next= 10
        }

        //To jump, error or next: stepCallback.next = flow row
        //To
        //fim do código externo
    } catch (e) {
        //se der erro...
        stepCallback.pergunta = 'Ocorreu um erro.'
        stepCallback.time = 0;
        stepCallback.next = saltoErro;
        console.log(e)
    }
    await finishCallback()
    resolve()
})