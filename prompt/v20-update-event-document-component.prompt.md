# Context
`libs\ecsas\feature-event\src\lib\pages\event-detail\event-document` list documents of current event. For now we assume only add, visualize or update document can be done.

# Instruction
- move `event-document-card` component to `libs\ecsas\feature-event\src\lib\pages\event-detail\event-document\event-document-card`
- Update `event-document-card` component to handle add, visualize ande update document in this card check `libs\ecsas\shared-ui\src\lib\molecules\upload-document-card` and the following code exemple picked from `libs\ecsas\feature-procedure\src\lib\pages\detail-application`
`<div class="col-span-2 flex  items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-blue-500 transition group cursor-pointer">
    <div class="flex items-center">
        <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center font-bold text-xs mr-3">
            <i class="pi pi-file text-lg"></i>
        </div>
        <div>
            <p class="text-sm font-bold text-slate-700">{{ source?.name }}</p>
            <p class="text-[10px] text-slate-400 uppercase font-medium">Ajouté le {{ source?.uploadedAt | date: 'dd/MM/yyyy' }}</p>
        </div>
    </div>
    <button type="button" (click)="displaySource(source)" class="p-2 text-slate-400" type="button">
        <i class="pi pi-eye"></i>
    </button>
</div>`
to have more inspiration
- handle logic to visualize document you can read `libs\ecsas\feature-procedure\src\lib\pages\detail-application` to see code exemples
