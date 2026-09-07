# Context
Event detail component code is too long I want to split it in small components to make it more maintainable.


# Instruction
1. read `libs\ecsas\feature-event\src\lib\pages\event-detail`
2. create `libs\ecsas\feature-event\src\lib\pages\event-detail\event-header` (event-header component)
Use the following code as design for the event-header component and display event description in event-header component
`
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
    <div>
      <h2 class="text-3xl font-bold text-[#1A365D]">Événements</h2>
      <p class="text-slate-500 text-sm mt-2">Gérez les événements de la commission santé et action sociale.</p>
    </div>
    <div class="flex space-x-3">
      <button type="button" class="px-4 py-3 text-sm font-medium rounded-lg bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-sm">
        <i class="pi pi-download mr-2" style="font-size: 0.85rem"></i> Exporter (Excel)
      </button>
      <button type="button" class="px-4 py-3 text-sm font-medium rounded-lg text-white bg-[#1A365D] hover:bg-blue-800 transition shadow-sm" onclick="document.getElementById('create-event-dialog').classList.remove('hidden')">
        <i class="pi pi-plus mr-2" style="font-size: 0.85rem"></i> Nouvel événement
      </button>
    </div>
  </div>
`

3. create `libs\ecsas\feature-event\src\lib\pages\event-detail\event-document` (event-document component) and event-document card component in event-document component folder

4. create `libs\ecsas\feature-event\src\lib\pages\event-detail\event-info` (event-document info component) which call child component created in this folder: event-link-list-component, event-partner-list-component and event-expense-list-component.
- remove description card in this section
- `event-expense-list-component` should use the following design:
`
              <!-- Budget / Dépenses -->
              <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h3 class="text-sm font-black text-[#1A365D] uppercase tracking-wider">
                    <i class="pi pi-money-bill mr-2"></i> Budget / Dépenses
                  </h3>
                  <button type="button" class="px-4 py-2 text-sm font-medium rounded-lg bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-sm">
                    <i class="pi pi-plus mr-2" style="font-size: 0.8rem"></i> Ajouter un poste
                  </button>
                </div>

                <!-- Summary -->
                <div class="grid grid-cols-3 gap-4 p-6 border-b border-slate-100">
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget prévu</p>
                    <p class="mt-1 text-lg font-black text-[#1A365D]">2 500 000 FCFA</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dépenses engagées</p>
                    <p class="mt-1 text-lg font-black text-slate-700">1 850 000 FCFA</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Solde restant</p>
                    <p class="mt-1 text-lg font-black text-emerald-600">650 000 FCFA</p>
                  </div>
                  <div class="col-span-3">
                    <div class="flex items-center justify-between mb-1 text-xs font-semibold text-slate-500">
                      <span>Taux d'exécution</span>
                      <span>74%</span>
                    </div>
                    <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div class="h-full rounded-full bg-[#3182CE]" style="width: 74%"></div>
                    </div>
                  </div>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th class="px-6 py-4">Poste</th>
                        <th class="px-6 py-4">Catégorie</th>
                        <th class="px-6 py-4">Prévu</th>
                        <th class="px-6 py-4">Dépensé</th>
                        <th class="px-6 py-4">Écart</th>
                        <th class="px-6 py-4">Date</th>
                        <th class="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      <tr class="hover:bg-slate-50 transition">
                        <td class="px-6 py-4 font-semibold text-slate-700">Location chapiteau & sonorisation</td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">Logistique</span>
                        </td>
                        <td class="px-6 py-4">600 000 FCFA</td>
                        <td class="px-6 py-4">600 000 FCFA</td>
                        <td class="px-6 py-4 text-slate-400 font-semibold">—</td>
                        <td class="px-6 py-4 text-slate-500">01 août 2026</td>
                        <td class="px-6 py-4 text-right text-slate-400">
                          <i class="pi pi-pencil cursor-pointer hover:text-[#3182CE] mr-3" style="font-size: 0.8rem"></i>
                          <i class="pi pi-trash cursor-pointer hover:text-rose-500" style="font-size: 0.8rem"></i>
                        </td>
                      </tr>
                      <tr class="hover:bg-slate-50 transition">
                        <td class="px-6 py-4 font-semibold text-slate-700">Catering et restauration</td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700">Restauration</span>
                        </td>
                        <td class="px-6 py-4">800 000 FCFA</td>
                        <td class="px-6 py-4">720 000 FCFA</td>
                        <td class="px-6 py-4 text-emerald-600 font-semibold">+80 000 FCFA</td>
                        <td class="px-6 py-4 text-slate-500">03 août 2026</td>
                        <td class="px-6 py-4 text-right text-slate-400">
                          <i class="pi pi-pencil cursor-pointer hover:text-[#3182CE] mr-3" style="font-size: 0.8rem"></i>
                          <i class="pi pi-trash cursor-pointer hover:text-rose-500" style="font-size: 0.8rem"></i>
                        </td>
                      </tr>
                      <tr class="hover:bg-slate-50 transition">
                        <td class="px-6 py-4 font-semibold text-slate-700">Impression et affichage</td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">Communication</span>
                        </td>
                        <td class="px-6 py-4">250 000 FCFA</td>
                        <td class="px-6 py-4">180 000 FCFA</td>
                        <td class="px-6 py-4 text-emerald-600 font-semibold">+70 000 FCFA</td>
                        <td class="px-6 py-4 text-slate-500">04 août 2026</td>
                        <td class="px-6 py-4 text-right text-slate-400">
                          <i class="pi pi-pencil cursor-pointer hover:text-[#3182CE] mr-3" style="font-size: 0.8rem"></i>
                          <i class="pi pi-trash cursor-pointer hover:text-rose-500" style="font-size: 0.8rem"></i>
                        </td>
                      </tr>
                      <tr class="hover:bg-slate-50 transition">
                        <td class="px-6 py-4 font-semibold text-slate-700">Sécurité et secourisme</td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">Logistique</span>
                        </td>
                        <td class="px-6 py-4">200 000 FCFA</td>
                        <td class="px-6 py-4">200 000 FCFA</td>
                        <td class="px-6 py-4 text-slate-400 font-semibold">—</td>
                        <td class="px-6 py-4 text-slate-500">05 août 2026</td>
                        <td class="px-6 py-4 text-right text-slate-400">
                          <i class="pi pi-pencil cursor-pointer hover:text-[#3182CE] mr-3" style="font-size: 0.8rem"></i>
                          <i class="pi pi-trash cursor-pointer hover:text-rose-500" style="font-size: 0.8rem"></i>
                        </td>
                      </tr>
                      <tr class="hover:bg-slate-50 transition">
                        <td class="px-6 py-4 font-semibold text-slate-700">Cadeaux et kits aux familles</td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700">Distribution</span>
                        </td>
                        <td class="px-6 py-4">650 000 FCFA</td>
                        <td class="px-6 py-4">150 000 FCFA</td>
                        <td class="px-6 py-4 text-emerald-600 font-semibold">+500 000 FCFA</td>
                        <td class="px-6 py-4 text-slate-500">En cours</td>
                        <td class="px-6 py-4 text-right text-slate-400">
                          <i class="pi pi-pencil cursor-pointer hover:text-[#3182CE] mr-3" style="font-size: 0.8rem"></i>
                          <i class="pi pi-trash cursor-pointer hover:text-rose-500" style="font-size: 0.8rem"></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
`
