import blessed from 'blessed';

//construindo o layout
export default class ComponentsBuilder {

    #screen
    #layout
    #input
    #chat
    #status
    #activityLog

    constructor() { }

    //retornado as propriedades padrões do component 
    #baseComponent() {
        return {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollbars: {
                ch: ' ',
                inverse: true
            },
            //habilita colocar cores e tags no text
            tags: true
        }
    }

    //componente inicial, retornando a tela
    setScreen({ title }) {
        this.#screen = blessed.screen({
            smartCSR: true,
            title
        })

        this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
        return this

    }

    //criando os quadrados ta tela
    setLayoutComponent() {
        this.#layout = blessed.layout({
            parent: this.#screen,
            width: '100%',
            height: '100%'
        })
        return this
    }

    //crtiando o textarea para pode pega o texto inserido
    setInputComponent(onEnterPressed) {
        const input = blessed.textarea({
            parent: this.#screen,
            bottom: 0,
            height: '10%',
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2
            },
            style: {
                fg: '#F6F6F6',
                BG: '#353535'
            }
        })

        input.key('enter', onEnterPressed)
        this.#input = input

        return this
    }

    setChatComponent() {
        this.#chat = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            align: 'left',
            width: '50%',
            height: '90%',
            items: ['{bold}Messenger{/}']

        })
        return this
    }

    //controle de usuarios logaods
    setStatusComponent() {
        this.#status = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            items: ['{bold}Users on Room{/}']

        })

        return this
    }

    //controle de aticidade dos usuarios 
    setActivityLogComponent() {
        this.#activityLog = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            style: {
                fg: 'yellow'
            },
            items: ['{bold}Activity Log{/}']

        })

        return this
    }

    //vai retornar o objeto para tela
    build() {
        const components = {
            screen: this.#screen,
            input: this.#input,
            chat: this.#chat,
            status: this.#status,
            activityLog: this.#activityLog
        }

        return components
    }
}