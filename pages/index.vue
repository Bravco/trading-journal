<template>
    <div>
        <div class="summary-wrapper">
            <div class="summary-container">
                <div class="summary-container-txt">
                    <span class="summary-container-title">
                        Net P&L
                        <UTooltip text="Your total amount of your profits and losses.">
                            <UIcon name="i-ph-info-duotone"/>
                        </UTooltip>
                        <UBadge variant="soft" color="gray">12</UBadge>
                    </span>
                    <span class="summary-container-value">€ 107.29</span>
                </div>
                <UButton
                    icon="i-ph-bank-duotone"
                    size="xl"
                    variant="soft"
                    color="primary"
                />
            </div>
            <div class="summary-container">
                <div class="summary-container-txt">
                    <span class="summary-container-title">
                        Trade Expectancy
                        <UTooltip text="Average outcome value of your trades.">
                            <UIcon name="i-ph-info-duotone"/>
                        </UTooltip>
                    </span>
                    <span class="summary-container-value">€ +17.84</span>
                </div>
                <UButton
                    icon="i-ph-chart-line-duotone"
                    size="xl"
                    variant="soft"
                    color="primary"
                />
            </div>
            <div class="summary-container">
                <div class="summary-container-txt">
                    <span class="summary-container-title">
                        Profit Factor
                        <UTooltip text="Average risk/reward ratio of your trades.">
                            <UIcon name="i-ph-info-duotone"/>
                        </UTooltip>
                    </span>
                    <span class="summary-container-value">0.43</span>
                </div>
                <UButton
                    icon="i-ph-compass-tool-duotone"
                    size="xl"
                    variant="soft"
                    color="primary"
                />
            </div>
            <div class="summary-container">
                <div class="summary-container-txt">
                    <span class="summary-container-title">
                        Win Rate
                        <UTooltip text="Average chance to win a trade.">
                            <UIcon name="i-ph-info-duotone"/>
                        </UTooltip>
                        <UBadge variant="soft" color="primary">1</UBadge>
                        <UBadge variant="soft" color="brink-pink">3</UBadge>
                    </span>
                    <span class="summary-container-value">% 25.00</span>
                </div>
                <v-progress-circular
                    :model-value="25"
                    :size="96"
                    :width="8"
                    color="var(--color-primary)"
                    bg-color="var(--color-brink-pink)"
                    style="stroke-linecap: round;"
                />
            </div>
        </div>
        <div class="trades-wrapper">
            <div class="calendar-container">
                <div class="calendar-header">
                    <UButton 
                        @click="previousMonth()" 
                        variant="ghost"
                        color="gray"
                        icon="i-ph-caret-left-duotone"
                        square
                    />
                    <UButton 
                        @click="nextMonth()" 
                        variant="ghost"
                        color="gray"
                        icon="i-ph-caret-right-duotone"
                        square
                    />
                    <span class="calendar-header-title">
                        {{ selectedDate.toLocaleString('en-us',{month:'short', year:'numeric'}) }}
                    </span>
                </div>
                <hr class="calendar-divider">
                <div class="calendar-day-grid">
                    <span v-for="weekday in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="weekday" class="calendar-weekday">
                        {{ weekday }}
                    </span>
                    <button 
                        v-for="date in viewedDates" 
                        :key="date.getTime()"
                        @click="selectedDate = date"
                        :disabled="date.getMonth() !== selectedDate.getMonth()"
                        :class="[
                            'calendar-day',
                            Math.round(Math.random()) ? (Math.round(Math.random()) ? 'win' : 'lose') : '',
                            {'selected': date.toDateString() === selectedDate.toDateString()},
                            {'irrelevant': date.getMonth() !== selectedDate.getMonth()}
                        ]"
                    >
                        <span class="calendar-day-index">{{ date.getDate() }}</span>
                        <span class="calendar-day-result">€ +16.77</span>
                        <span class="calendar-day-tradecount">2 trades</span>
                    </button>
                </div>
            </div>
            <div class="trades-container">
                <div class="trades-header">
                    <span>{{ selectedDate.toDateString() }}</span>
                </div>
                <hr class="trades-divider">
                <UTable
                    class="trades-table"
                    :rows="viewedTrades"
                    :columns="columns"
                    :empty-state="{ icon: 'i-ph-folder-notch-open-duotone', label: 'No trades.' }"
                >
                    <template #isBuy-data="{ row }">
                        <span :class="['trades-table-trend', row.isBuy ? 'buy' : 'sell']">{{ row.isBuy ? "BUY" : "SELL" }}</span>
                    </template>
                    <template #margin-data="{ row }">
                        <span>{{ `€ ${row.margin}` }}</span>
                    </template>
                    <template #risk-data="{ row }">
                        <span>{{ row.risk.toFixed(2) }}</span>
                    </template>
                    <template #result-data="{ row }">
                        <span v-if="row.result" :class="['trades-table-result', row.result < 0 ? 'lose' : 'win']">{{ `€ ${row.result < 0 ? '' : '+'}${row.result.toFixed(2)}` }}</span>
                    </template>
                    <template #actions-data="{ row }">
                        <UDropdown
                            :items="[
                                [
                                    {
                                        label: 'View',
                                        icon: 'i-ph-eye-duotone',
                                        click: () => openViewModal(row),
                                    },
                                    {
                                        label: 'Edit',
                                        icon: 'i-ph-pencil-line-duotone',
                                        click: () => openEditModal(row),
                                    },
                                ],
                                [{
                                    label: 'Delete',
                                    icon: 'i-ph-trash-duotone',
                                    click: () => console.log(`Delete ${row}`),
                                }],
                            ]"
                        >
                            <UButton color="gray" variant="ghost" icon="i-ph-dots-three-duotone"/>
                        </UDropdown>
                    </template>
                </UTable>
                <UButton @click="openEditModal()" class="new-trade-btn" icon="i-ph-plus-duotone">
                    New Trade
                </UButton>
            </div>
        </div>
        <UModal v-model="editModal" @close="closeEditModal()">
            <UCard>
                <template #header>
                    <div class="modal-header">
                        <h1>{{ editedTradeId ? 'Edit Trade' : 'New Trade' }}</h1>
                        <UButton
                            icon="i-ph-x-duotone"
                            variant="ghost"
                            color="gray"
                            square
                            @click="closeEditModal()"
                        />
                    </div>
                </template>
                <UForm @submit="onModalSubmit" :state="newTradeState" :validate="newTradeValidate" class="new-trade-form">
                    <UFormGroup name="time" label="Trade Time" required>
                        <UInput v-model="newTradeState.time" type="datetime-local"/>
                    </UFormGroup>
                    <UFormGroup name="instrument" label="Instrument" required>
                        <UInput v-model="newTradeState.instrument" icon="i-ph-presentation-chart-duotone"/>
                    </UFormGroup>
                    <UFormGroup name="isBuy" label="Trend" required>
                        <USelectMenu v-model="newTradeState.isBuy" :options="['true', 'false']" icon="i-ph-trend-up-duotone">
                            <template v-if="newTradeState.isBuy !== null" #label>
                                <span :class="[JSON.parse(newTradeState.isBuy) ? 'bg-primary-400' : 'bg-brink-pink-400', 'inline-block h-2 w-2 flex-shrink-0 rounded-full']" aria-hidden="true"/>
                                <span>{{ JSON.parse(newTradeState.isBuy) ? 'BUY' : 'SELL' }}</span>
                            </template>
                            <template #option="{ option }">
                                <span :class="[JSON.parse(option) ? 'bg-primary-400' : 'bg-brink-pink-400', 'inline-block h-2 w-2 flex-shrink-0 rounded-full']" aria-hidden="true"/>
                                <span>{{ JSON.parse(option) ? 'BUY' : 'SELL' }}</span>
                            </template>
                        </USelectMenu>
                    </UFormGroup>
                    <UFormGroup name="margin" label="Margin" type="number" required>
                        <UInput v-model="newTradeState.margin" icon="i-ph-currency-eur-duotone"/>
                    </UFormGroup>
                    <UFormGroup name="risk" label="Risk / Reward Ratio" type="number" required>
                        <UInput v-model="newTradeState.risk" icon="i-ph-percent-duotone"/>
                    </UFormGroup>
                    <UFormGroup name="result" label="Result" type="number">
                        <UInput v-model="newTradeState.result" icon="i-ph-equals-duotone"/>
                    </UFormGroup>
                    <UButton type="submit" icon="i-ph-plus-duotone">{{ editedTradeId ? 'Update Trade' : 'Create Trade' }}</UButton>
                </UForm>
            </UCard>
        </UModal>
        <UModal v-model="viewModal" @close="closeViewModal()">
            <UCard>
                <template #header>
                    <div class="modal-header">
                        <h1>View Trade</h1>
                        <UButton
                            icon="i-ph-x-duotone"
                            variant="ghost"
                            color="gray"
                            square
                            @click="closeViewModal()"
                        />
                    </div>
                </template>
                <div class="viewed-trade-form">
                    <div class="viewed-trade-item">
                        <p class="viewed-trade-item-title">Trade Time</p>
                        <span class="viewed-trade-item-content">
                            <UIcon class="text-gray-500" name="i-ph-calendar-blank-duotone"/>
                            {{ viewedTrade?.time.toLocaleString().slice(0, 18) }}
                        </span>
                    </div>
                    <div class="viewed-trade-item">
                        <p class="viewed-trade-item-title">Instrument</p>
                        <span class="viewed-trade-item-content">
                            <UIcon class="text-gray-500" name="i-ph-presentation-chart-duotone"/>
                            {{ viewedTrade?.instrument }}
                        </span>
                    </div>
                    <div class="viewed-trade-item">
                        <p class="viewed-trade-item-title">Trend</p>
                        <span class="viewed-trade-item-content">
                            <UIcon class="text-gray-500" name="i-ph-trend-up-duotone"/>
                            {{ viewedTrade?.isBuy ? "BUY" : "SELL" }}
                        </span>
                    </div>
                    <div class="viewed-trade-item">
                        <p class="viewed-trade-item-title">Margin</p>
                        <span class="viewed-trade-item-content">
                            <UIcon class="text-gray-500" name="i-ph-currency-eur-duotone"/>
                            {{ viewedTrade?.margin.toFixed(2) }}
                        </span>
                    </div>
                    <div class="viewed-trade-item">
                        <p class="viewed-trade-item-title">Risk</p>
                        <span class="viewed-trade-item-content">
                            <UIcon class="text-gray-500" name="i-ph-percent-duotone"/>
                            {{ viewedTrade?.risk.toFixed(2) }}
                        </span>
                    </div>
                    <div class="viewed-trade-item">
                        <p class="viewed-trade-item-title">Result</p>
                        <span class="viewed-trade-item-content">
                            <UIcon class="text-gray-500" name="i-ph-equals-duotone"/>
                            {{ viewedTrade?.result === null ? '' : viewedTrade?.result.toFixed(2)  }}
                        </span>
                    </div>
                </div>
            </UCard>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
    import type { FormSubmitEvent } from "#ui/types";
    import useVuelidate from "@vuelidate/core";
    import { required, decimal } from "@vuelidate/validators";

    type Trade = {
        id: number,
        time: Date,
        instrument: string,
        isBuy: boolean,
        margin: number,
        risk: number,
        result: number | null,
    };

    type NewTradeState = {
        time: string | null
        instrument: string | null,
        isBuy: string | null,
        margin: number | null,
        risk: number | null,
        result: number | null,
    };

    const columns = [
        {
            key: "instrument",
            label: "Instrument",
        },
        {
            key: "isBuy",
            label: "Trend",
        },
        {
            key: "margin",
            label: "Margin",
        },
        {
            key: "risk",
            label: "Risk",
        },
        {
            key: "result",
            label: "Result",
        },
        {
            key: "actions",
        },
    ];

    const trades = ref<Trade[]>([
        {
            id: 0,
            time: new Date(),
            instrument: "EURUSD",
            isBuy: true,
            margin: 100.26,
            risk: 1.86,
            result: 2.78,
        },
        {
            id: 1,
            time: new Date(),
            instrument: "AUDUSD",
            isBuy: true,
            margin: 99.12,
            risk: 0.97,
            result: -1.56,
        },
        {
            id: 2,
            time: new Date(),
            instrument: "GBPUSD",
            isBuy: false,
            margin: 115.33,
            risk: 2.15,
            result: 3.12,
        },
        {
            id: 3,
            time: new Date(),
            instrument: "GOLD",
            isBuy: true,
            margin: 107.54,
            risk: 2,
            result: null,
        },
    ]);

    const selectedDate = ref<Date>(new Date());
    const editModal = ref<boolean>(false);
    const editedTradeId = ref<number | null>(null);
    const viewModal = ref<boolean>(false);
    const viewedTrade = ref<Trade | null>(null);

    const newTradeState : NewTradeState = reactive({
        time: null,
        instrument: null,
        isBuy: null,
        margin: null,
        risk: null,
        result: null,
    });
    
    const newTradeRules = {
        time: { required },
        instrument: { required },
        isBuy: { required },
        margin: { required, decimal },
        risk: { required, decimal },
        result: { decimal },
    };

    const v$ = useVuelidate(newTradeRules, newTradeState);

    const viewedDates = computed(() => {
        return getMonthDates(selectedDate.value.getFullYear(), selectedDate.value.getMonth()+1);
    });

    const viewedTrades = computed(() => {
        const viewedTrades : Trade[] = [];
        trades.value.map(trade => {
            if (trade.time.toDateString() === selectedDate.value.toDateString())
                viewedTrades.push(trade);
        });
        return viewedTrades;
    });

    function getMonthDates(year : number, month : number) : Date[] {
        const currentDate = new Date(year, month-1, 1);
        const dates : Date[] = [];

        while (currentDate.getDay() !== 1) {
            currentDate.setDate(currentDate.getDate()-1);
        }

        for (let i = 0; i < 7*6; i++) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate()+1);
        }

        return dates;
    }

    function previousMonth() {
        let currentMonth : number = selectedDate.value.getMonth();
        if (currentMonth === 0) {
            selectedDate.value = new Date(
                selectedDate.value.getFullYear()-1,
                11,
                selectedDate.value.getDate()
            );
        } else {
            selectedDate.value = new Date(
                selectedDate.value.getFullYear(),
                currentMonth-1,
                selectedDate.value.getDate()
            );
        }
    }

    function nextMonth() {
        let currentMonth : number = selectedDate.value.getMonth();
        if (currentMonth === 11) {
            selectedDate.value = new Date(
                selectedDate.value.getFullYear()+1,
                0,
                selectedDate.value.getDate()
            );
        } else {
            selectedDate.value = new Date(
                selectedDate.value.getFullYear(),
                currentMonth+1,
                selectedDate.value.getDate()
            );
        }
    }

    function openEditModal(trade : Trade | null = null) {
        if (trade) {
            editedTradeId.value = trade.id;
            newTradeState.time = trade.time.toISOString().slice(0, 16);
            newTradeState.instrument = trade.instrument;
            newTradeState.isBuy = trade.isBuy.toString();
            newTradeState.margin = trade.margin;
            newTradeState.risk = trade.risk;
            newTradeState.result = trade.result;
        }
        editModal.value = true;
    }

    function closeEditModal() {
        editModal.value = false;
        editedTradeId.value = null;
        Object.keys(newTradeState).forEach(key => newTradeState[key as keyof NewTradeState] = null);
    }

    function openViewModal(trade : Trade) {
        viewedTrade.value = trade;
        viewModal.value = true;
    }

    function closeViewModal() {
        viewedTrade.value = null;
        viewModal.value = false;
    }

    async function newTradeValidate() {
        v$.value.$touch();
        await v$.value.$validate();
        return v$.value.$errors.map((error) => ({
            message: error.$message,
            path: error.$propertyPath,
        }));
    }

    async function onModalSubmit(event : FormSubmitEvent<{
        time: string
        instrument: string,
        isBuy: string,
        margin: string,
        risk: string,
        result: string | null,
    }>) {
        const newTrade = {
            id: editedTradeId.value !== null ? editedTradeId.value : trades.value.length,
            time: new Date(event.data.time),
            instrument: event.data.instrument,
            isBuy: JSON.parse(event.data.isBuy),
            margin: parseFloat(event.data.margin),
            risk: parseFloat(event.data.risk),
            result: event.data.result === null || event.data.result === "" 
                ? null 
                : parseFloat(event.data.result),
        };

        if (editedTradeId.value) trades.value[editedTradeId.value] = newTrade;
        else trades.value.push(newTrade);

        closeEditModal();
    }
</script>

<style scoped>
    .summary-wrapper {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
    }

    .summary-container, .calendar-container, .trades-container {
        width: 100%;
        background-color: var(--color-bg-secondary);
        border: 1px solid var(--color-bg-tertiary);
        border-radius: .5rem;
    }

    .summary-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
        padding: 2rem;
    }

    .summary-container-txt {
        min-width: max-content;
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .summary-container-title {
        display: flex;
        align-items: center;
        gap: .5rem;
        color: var(--color-text-alt);
    }

    .summary-container-value {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .trades-wrapper {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        padding-top: 2rem;
    }

    .calendar-container, .trades-container {
        position: relative;
        padding: 1rem 2rem 2rem 2rem;
    }

    .calendar-header, .trades-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }

    .calendar-header-title {
        margin-left: 1rem;
    }

    .calendar-divider, .trades-divider {
        width: 100%;
        position: absolute;
        left: 0;
        border-color: var(--color-bg-tertiary);
    }

    .calendar-day-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 1rem;
        padding-top: 2rem;
    }

    .calendar-weekday {
        padding: .25rem 0;
        text-align: center;
        font-weight: bold;
        color: var(--color-text-alt);
        border: 1px solid var(--color-bg-tertiary);
        border-radius: .5rem;
    }

    .calendar-day {
        --_color-bg: transparent;
        --_color-border: var(--color-text-alt);
        --_color-calendar-day-result: var(--color-text);

        min-height: 6rem;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        padding: 0 1rem;
        background-color: var(--_color-bg);
        border: 1px solid var(--_color-border);
        border-radius: .5rem;
    }

    .calendar-day.calendar-day.irrelevant {
        --_color-bg: transparent;
        --_color-border: var(--color-bg-tertiary);
    }

    .calendar-day.irrelevant > * {
        display: none;
    }

    .calendar-day.win {
        --_color-border: transparent;
        --_color-bg: var(--color-primary-alt);
        --_color-calendar-day-result: var(--color-primary);
    }

    .calendar-day.lose {
        --_color-bg: var(--color-brink-pink-alt);
        --_color-border: transparent;
        --_color-calendar-day-result: var(--color-brink-pink);
    }

    .calendar-day.selected {
        --_color-border: var(--color-text);
    }

    .calendar-day.selected.win {
        --_color-border: var(--color-primary);
    }

    .calendar-day.selected.lose {
        --_color-border: var(--color-brink-pink);
    }

    .calendar-day-index, .calendar-day-tradecount {
        font-size: 12px;
    }

    .calendar-day-index {
        padding-bottom: 1rem;
    }

    .calendar-day-result {
        color: var(--_color-calendar-day-result);
        font-weight: bold;
    }

    .trades-table {
        padding-bottom: 4rem;
    }

    .trades-table-trend {
        padding: .25rem .5rem;
        font-size: .75rem;
        font-weight: bold;
        border-radius: .25rem;
    }

    .trades-table-trend.buy {
        color: var(--color-primary);
        background-color: var(--color-primary-alt);
    }

    .trades-table-trend.sell {
        color: var(--color-brink-pink);
        background-color: var(--color-brink-pink-alt);
    }

    .trades-table-result {
        font-weight: bold;
    }

    .trades-table-result.win {
        color: var(--color-primary);
    }

    .trades-table-result.lose {
        color: var(--color-brink-pink);
    }

    .new-trade-btn {
        position: absolute;
        right: 2rem;
        bottom: 2rem;
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .new-trade-form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .new-trade-form button[type="submit"] {
        width: fit-content;
        grid-column: span 2;
        margin-left: auto;
        margin-top: 1rem;
    }

    .viewed-trade-form {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .viewed-trade-item {
        display: flex;
        flex-direction: column;
        gap: .25rem;
    }

    .viewed-trade-item-title {
        font-size: .85rem;
    }

    .viewed-trade-item-content {
        height: 100%;
        display: flex;
        align-items: center;
        gap: .5rem;
        padding: .2rem .5rem;
        background-color: var(--color-bg-tertiary);
        border: 1px solid rgb(var(--color-gray-700));
        border-radius: .375rem;
    }

    @media only screen and (max-width: 1488px) {
        .summary-wrapper {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .trades-wrapper {
            grid-template-columns: 1fr;
        }
    }

    @media only screen and (max-width: 1024px) {
        .calendar-day-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
        }

        .calendar-day.irrelevant, .calendar-weekday {
            display: none;
        }
    }

    @media only screen and (max-width: 768px) {
        .summary-wrapper {
            grid-template-columns: 1fr;
        }
    }

    @media only screen and (max-width: 640px) {
        .new-trade-form {
            grid-template-columns: 1fr;
        }

        .new-trade-form button[type="submit"] {
            grid-column: auto;
        }
    }
</style>