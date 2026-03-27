function(instance, context) {

    // Inizializza gli stati a valori neutri.
    // Questo evita il bug di circular dependency di Bubble
    // quando gli stati hanno valori dinamici nelle conditional.
    instance.publishState("is_valid", false);
    instance.publishState("error_message", "");
    instance.publishState("validated_value", "");
    instance.publishState("validation_type", "");

    // L'elemento è puramente logico: nascondi il container visivo.
    instance.canvas.css({
        width: "0px",
        height: "0px",
        overflow: "hidden",
        position: "absolute",
        pointerEvents: "none"
    });

}