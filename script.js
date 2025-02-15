function formatarCNPJ(input) {
    let cnpj = input.value.replace(/\D/g, '');

    if (cnpj.length <= 2) {
        cnpj = cnpj.replace(/^(\d{2})/, '$1');
    } else if (cnpj.length <= 5) {
        cnpj = cnpj.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
    } else if (cnpj.length <= 8) {
        cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (cnpj.length <= 12) {
        cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
    } else {
        cnpj = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
    }

    input.value = cnpj;
}
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function converterData(data) {
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
}

async function consultarCNPJ() {
    const cnpjComMascara = document.getElementById('cnpj').value;
    const cnpj = cnpjComMascara.replace(/\D/g, '');

    const resultadoDiv = document.getElementById('resultado');
    const editarBtn = document.getElementById('editar');
    const salvarBtn = document.getElementById('salvar');

    if (!resultadoDiv || !editarBtn || !salvarBtn) {
        console.error('Elementos não encontrados no DOM');
        return;
    }

    resultadoDiv.innerHTML = '';

    if (cnpj.length !== 14) {
        resultadoDiv.innerHTML = '<p style="color: red;">Por favor, insira um CNPJ válido.</p>';
        editarBtn.classList.add('hidden');
        salvarBtn.classList.add('hidden');
        return;
    }

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        if (!response.ok) throw new Error('Erro ao consultar CNPJ');

        const data = await response.json();

        resultadoDiv.innerHTML = `
            <h4>Informações Principais</h4>
            <hr>
            <form>

            <div class="">
                <label for="nome-fantasia">Nome:</label>
                <input type="text" class="form-control" id="nome-fantasia" value="${data.nome_fantasia || 'N/A'}" disabled />
            </div>

            <div class="">
                <label for="razao-social">Razão Social:</label>
                <input type="text" class="form-control" id="razao-social" value="${data.razao_social || 'N/A'}" disabled />
            </div>

            <div class="row">
                <div class="col-md-6">
                    <label for="inicio-atividade">Data de Abertura:</label>
                    <input type="text" class="form-control" id="inicio-atividade" value="${data.data_inicio_atividade ? formatarData(data.data_inicio_atividade) : 'N/A'}" disabled />
                </div>
            
                <div class="col-md-6">
                    <label for="situacao-cadastral">Situação:</label>
                    <input type="text" class="form-control" id="situacao-cadastral" value="${data.descricao_situacao_cadastral || 'N/A'}" disabled />
                </div>
            </div>

            <div class="">
                <label for="cnae-descricao">Atividade Principal:</label>
                <input type="text" class="form-control" id="cnae-descricao" value="${data.cnae_fiscal_descricao || 'N/A'}" disabled />
            </div>

            <h4>Endereço Completo</h4>
            <hr>
        
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="logradouro" class="form-label">Rua, avenida, travessa:</label>
                    <input type="text" class="form-control" id="logradouro" value="${data.logradouro || 'N/A'}" disabled />
                </div>
                <div class="col-md-2">
                    <label for="numero" class="form-label">Número:</label>
                    <input type="text" class="form-control" id="numero" value="${data.numero || 'N/A'}" disabled />
                </div>
                <div class="col-md-4">
                    <label for="complemento" class="form-label">Complemento:</label>
                    <input type="text" class="form-control" id="complemento" value="${data.complemento || 'N/A'}" disabled />
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-3">
                    <label for="bairro" class="form-label">Bairro:</label>
                    <input type="text" class="form-control" id="bairro" value="${data.bairro || 'N/A'}" disabled />
                </div>
                <div class="col-md-3">
                    <label for="cep" class="form-label">CEP:</label>
                    <input type="text" class="form-control" id="cep" value="${data.cep || 'N/A'}" disabled />
                </div>
                <div class="col-md-3">
                    <label for="municipio" class="form-label">Município:</label>
                    <input type="text" class="form-control" id="municipio" value="${data.municipio || 'N/A'}" disabled />
                </div>
                <div class="col-md-3">
                    <label for="uf" class="form-label">UF:</label>
                    <input type="text" class="form-control" id="uf" value="${data.uf || 'N/A'}" disabled />
                </div>
            </div>

            <h4>Contato</h4>
            <hr>
            
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="telefone" class="form-label">Telefone:</label>
                    <input type="text" class="form-control" id="telefone" value="${data.ddd_telefone_1 || 'N/A'}" disabled />
                </div>
                <div class="col-md-6">
                    <label for="email" class="form-label">e-Mail:</label>
                    <input type="text" class="form-control" id="email" value="${data.email || 'N/A'}" disabled />
                </div>
            </div>
        </form> 
        `;

        editarBtn.classList.remove('hidden');
        salvarBtn.classList.add('hidden');
    } catch (error) {
        resultadoDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        editarBtn.classList.add('hidden');
        salvarBtn.classList.add('hidden');
    }
}

document.getElementById('editar').addEventListener('click', function () {
    const inputs = document.querySelectorAll('#resultado input');
    inputs.forEach(input => input.disabled = false);


    document.getElementById('editar').classList.add('hidden');
    document.getElementById('salvar').classList.remove('hidden');
});

document.getElementById('salvar').addEventListener('click', function () {
    const dadosEditados = {
        nome_fantasia: document.getElementById('nome-fantasia').value,
        razao_social: document.getElementById('razao-social').value,
        data_inicio_atividade: document.getElementById('inicio-atividade').value ? converterData(document.getElementById('inicio-atividade').value) : '',
        descricao_situacao_cadastral: document.getElementById('situacao-cadastral').value,
        cnae_fiscal_descricao: document.getElementById('cnae-descricao').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        cep: document.getElementById('cep').value,
        municipio: document.getElementById('municipio').value,
        uf: document.getElementById('uf').value,
        ddd_telefone_1: document.getElementById('telefone').value,
        email: document.getElementById('email').value
    };

    console.log('Dados editados:', dadosEditados);

    alert('Dados editado com sucesso!');

    const inputs = document.querySelectorAll('#resultado input');
    inputs.forEach(input => input.disabled = true);

    document.getElementById('salvar').classList.add('hidden');
    document.getElementById('editar').classList.remove('hidden');
});
