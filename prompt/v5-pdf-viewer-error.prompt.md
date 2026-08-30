# Context
The pdf viewer component in `libs\ecsas\shared-ui\src\lib\molecules\pdf-viewer` can display pdf file or images from Source object `libs\shared\models\src\lib\source.model.ts`. Update this component to handle errors when fetchSource fail and loading state


# Instructions
Display this message: `Impossible de charger le document cliquez sur ce bouton pour réessayer` with an icone an a button to trigger retry button component is avaible in `libs\ecsas\shared-ui\src\lib\atoms\button`. Here is an code exemple of button usage:
`
        <lib-button routerLink="/procedure/new-application" type="primary">
            <i class="pi pi-plus"></i>
            Nouvelle demande
        </lib-button>
`
You can be inspired by `libs\ecsas\feature-procedure\src\lib\procedure-list\procedure-list.component.html` to see how I handle no data an loading state.
