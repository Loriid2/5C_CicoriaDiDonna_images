export const generateModalForm = (parentElement) => {
    let configuration;
    let submitCallback, cancelCallback;
    let idForm;

    return {
        build: (inputConfiguration, inputIdForm) => {
            configuration = inputConfiguration;
            idForm = inputIdForm;
        },
        onsubmit: (inputCallback) => {
            submitCallback = inputCallback;
        },
        oncancel: (inputCallback) => {
            cancelCallback = inputCallback;
        },
        render: (preValues) => {
            /*
            const loginFormOutput = {
                username: "nomeLogin123",
                password: "password1234"
            }
            */

            let html = '<form id="form' + idForm + '" class="">';

            let labels = Object.keys(configuration);

            labels.forEach(e => {
                if (preValues == null) {

                    html += `
                    <div class="">
                        <div class="">
                            <label class=""
                                for="${e}">
                                ${e}
                            </label>
                            <input
                                class="${configuration[e][1]}"
                                type="${configuration[e][0]}" name=${e} id=${e}>
                        </div>
                    </div>`
                } else {
                    html += `
                    <div class="">
                        <div class="">
                            <label class=""
                                for="${e}">
                                ${e}
                            </label>
                            <input
                                class="${configuration[e][1]}"
                                type="${configuration[e][0]}" name=${e} id=${e} value="${preValues[e]}">
                        </div>
                    </div>`
                }
            });
            
            document.getElementById(idForm + "Footer").innerHTML = `<button id="closeButton${idForm}" type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                                                    <button id="submitButton${idForm}" type="button" class="btn btn-success" data-bs-dismiss="modal">Submit</button>` ;      
            
            html += '<div style="color: red;" id="errorDiv' + idForm + '"></div>';

            parentElement.innerHTML = html;
            
            document.querySelectorAll('.close-modal').forEach(btn => {
                toggleModal('remove', btn);
            });

            const submitButton = document.getElementById("submitButton" + idForm);

            submitButton.onclick = () => {
                let result = labels.map((name) => {
                    return document.getElementById(name).value ? document.getElementById(name).value : document.getElementById(name).checked;
                })

                //console.log(result) ;
                submitCallback(result, configuration);
            }
        },
        setStatus: (text) => {
            document.getElementById("errorDiv" + idForm).innerText = text;
        },
        setType: (inputType) => {
            type = inputType;
        },
        clear: () => {
            document.querySelectorAll(".form-control").forEach(e => e.value = "");
            document.querySelector("#hourInput").value = configuration[0];
        }
    };
};