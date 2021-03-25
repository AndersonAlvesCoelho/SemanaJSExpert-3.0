import ComponentsBuilder from './components.js';
import { constants } from './constants.js';

export default class TerminalConroller {
    #usersCollors = new Map()

    constructor() { }

    //mudar a cor dinamicamente conforme os usuarios forem entrando
    #pickCollor() {
        return `#` + ((1 << 24) * Math.random() | 0).toString(16) + '-fg'
    }

    //de acorde com usuario vai selecionado um cor para o nome dele
    #getUserCollor(userName) {
        if (this.#usersCollors.has(userName)) return this.#usersCollors.get(userName)

        const collor = this.#pickCollor()
        this.#usersCollors.set(userName, collor)

        return collor
    }

    //retornar os eventos para o back-end
    #onInputReceived(eventEmitter) {
        return function () {
            const message = this.getValue()
            console.log(message)
            this.clearValue()
        }
    }

    //renderizar menssage no chat
    #onMessageReceived({ screen, chat }) {
        return msg => {
            const { userName, message } = msg
            const collor = this.#getUserCollor(userName)
            chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
            screen.render()
        }
    }

    #onLogChanged({ screen, activityLog }) {
        return msg => {
            //  user left
            //  user join
            const [userName] = msg.split(/\s/)
            const collor = this.#getUserCollor(userName)

            activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)
            screen.render()

        }
    }

    #onStatusChanged({ screen, status }) {
        // ['luiz', 'leticia', ... 'anderson']
        return users => {

            //pegando o primeiro elemento da lista
            const { content } = status.items.shift()
            status.clearItems()
            status.addItem(content)

            users.forEach(userName => {
                const collor = this.#getUserCollor(userName)
                status.addItem(`{${collor}}{bold}${userName}{/}`)
            })
            
            screen.render()
        }
    }

    //quando a messagem for recbida, pode assim atualizar o chat
    #registerEvents(eventEmitter, components) {
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
    }

    //função principal, chamando os componentes 
    async initializeTable(eventEmitter) {
        const components = new ComponentsBuilder()
            .setScreen({ title: 'HackerChat - Dev' })
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setActivityLogComponent()
            .setStatusComponent()
            .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()
    }
}