# Playing Deck

## Creating the component

Create the file 'PlayingDeck.vue' in the 'components' folder. This component will represent a deck of playing cards.

<tabs>
    <tab title="script">
        <code-block lang="html">
    <![CDATA[
        <script setup>
            const props = defineProps({
                deck: {
                    type: Array,
                    required: true
                }
            })
        </script>
    ]]>
    </code-block>
    </tab>
    <tab title="template">
        <code-block lang="html">
            <![CDATA[
                <template>
                    <div class="deck">
                        <!-- Render 3 overlapped card backs to represent the deck -->
                        <div
                                v-for="n in 3"
                                :key="n"
                                class="card-back"
                                :style="{ top: ((n - 1) * 3) + 'px', 
                                left: ((n - 1) * 3) + 'px' }"
                        ></div>
                    </div>
                </template>
            ]]></code-block>
    </tab>
    <tab title="style">
        <code-block lang="javascript">
            <![CDATA[
                <style scoped>
                    .deck {
                        position: relative;
                        width: 50px;
                        height: 70px;
                    }
                
                    /* Style for a card back */
                    .card-back {
                        position: absolute;
                        width: 50px;
                        height: 70px;
                        border: 1px solid #333;
                        border-radius: 5px;
                        background: repeating-linear-gradient(
                                45deg,
                                darkgreen,
                                rgb(149, 190, 149) 5px,
                                #0c1d0c 5px,
                                #05e405 10px
                        ); /* Pattern of squares */
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                    }
                </style>
                ]]></code-block>
        </tab>
    </tabs>

