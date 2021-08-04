/* LISTA PRODUTOS */

// para armazenar os produtos cadastrados
var listaProdutos = [];

// se já tiver algo armazenado no localstorage, armazena na lista ao executar
if (localStorage.getItem("listaProdutos")) {
	listaProdutos = JSON.parse(localStorage.getItem("listaProdutos"));
}

// função que salva o produto (cadastro e edição)
function salvar() {
	
	// verifica se o código de barras foi digitado corretamente
	if (verificaCodBarras()) {

		// para armazenar os valores do produto
		let obj = {};

		// armazena os valores digitados no formulário
		let indice = document.getElementById("input-indice").value;
		let nome = document.getElementById("input-nome").value;
		let qtd = document.getElementById("input-qtd").value;
		let unid = document.getElementById("input-unidade").value;
		let cod_barra = document.getElementById("input-cod-barra").value;
		let ativo = document.getElementById("input-ativo").checked;

		// armazena os valores no objeto
		obj = {
			nomeProduto: nome,
			quantidade: qtd,
			unidade: unid,
			codigoBarra: cod_barra,
			produtoAtivo: ativo
		};

		if (parseInt(indice) >= 0) { // edição

			// carrega o código do produto e armazena no objeto
			let cod = listaProdutos[indice].codigo;
			obj.codigo = cod;

			listaProdutos[indice] = obj;

			// carrega o índice deste produto na lista de compras
			let indiceCompras = getIndexProduto(listaCompras, cod);

			if (ativo && indiceCompras > -1) { // se o produto está ativo e já existe na lista
				listaCompras[indiceCompras] = obj;
			} else if (ativo && indiceCompras == -1) { // se o produto foi ativado mas não estava na lista
				listaCompras.push(obj);
			} else { // se o produto é desativado
				listaCompras.splice(indiceCompras, 1);
			}
		} else { // cadastro
			
			// variável auxiliar usada para guardar o código do novo produto
			let auxCod;
			if (listaProdutos.length > 0) { // se não for vazia, pega o último código
				auxCod = listaProdutos[listaProdutos.length - 1].codigo;
			} else { // se for vazia, inicia com 0
				auxCod = 0;
			}
			obj.codigo = auxCod+1;

			// insere o objeto na lista de produtos
			listaProdutos.push(obj);

			// se é ativo, insere o objeto também na lista de compras
			if (ativo) {
				listaCompras.push(obj);
			}
		}

		// armazena as listas no local storage  
		localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));
		localStorage.setItem("listaCompras", JSON.stringify(listaCompras));

		// chama a função que zera os campos do formulário
		resetForm("cadastra-produto");

		// chama a função para exibir a lista de produtos atualizada
		carregarProdutos();
	}
}

// função que verifica se o código de barras foi digitado corretamente
function verificaCodBarras() {

	// armazena o campo e o valor digitado
	let input = document.getElementById("input-cod-barra");
	let codBarras = input.value;

	if (!isNaN(codBarras)) { // se for um valor numérico
		// se for diferente de 13, alerta o usuário
		if (codBarras.length != 13) {
			alert("Digite 13 caracteres no campo Código de Barras.");

			// se for maior que 13, zera o campo
			if (codBarras.length > 13) {
				input.value = "";
			}

			// foca o cursor no campo
			input.focus();
		} else {
			return true;
		}
	} else {
		alert("Digite apenas números no campo 'Código de Barras'.");

		//zera o campo
		input.value = "";
		
		// foca o cursor no campo
		input.focus();
	}

	return false;
}

//limpa os campos do formulario
function resetForm(id) {
	let form = document.getElementById(id);
	form.reset();
	document.getElementById("input-indice").value = "";
}

//Cria no html uma box com os dados do produto inserido
function carregarProdutos() {

	// variáveis usadas para armazenar a div e o conteúdo
	let t1 = document.getElementById('lista-produtos');
	let linha = '';

	if (listaProdutos.length > 0) { // se houver elementos na lista
		for (let i = 0; i < listaProdutos.length; i++) {
			let { codigo, nomeProduto, quantidade, unidade, codigoBarra, produtoAtivo } = listaProdutos[i];
			
			linha += `<div class="box-produto">
									<img class="img-produto" src="imagens/product.png" alt="Imagem do produto" width="150px">
									<p>
										<span class="lista-nome">${nomeProduto}</span>
									</p>
									<p>
										Cód.:
										<span class="lista-cod">${codigo}</span>
									</p>
									<p>
										Qtd.:
										<span class="lista-qtd">${quantidade}</span>
										<span class="lista-un">${unidade}</span>
									</p>
									<p>
										Cód. Barras:
										<span class="lista-cod-barras">${codigoBarra}</span>
									</p>
									<p>
										Ativo:
										<span lista-ativo>${produtoAtivo}</span>
									</p>

									<form>
										<button class="bt-editar" type="button" onclick="editarProduto(${i});">Editar</button>
										<button class="bt-excluir" type="button" onclick="excluirProduto(${i});">Excluir</button>
									</form>
								</div>`;
		}
	} else { // se a lista for vazia
		linha += `<p>Não existem produtos cadastrados.</p>`;
	}

	// insere o conteúdo na div
	t1.innerHTML = linha;
}

//função que exclui um produto de determinada posição da lista
function excluirProduto(indice) {

	// exclui do lista compras (conexão atual e localstorage)
	listaCompras.splice(getIndexProduto(listaProdutos, listaProdutos[indice].codigo), 1);
	localStorage.setItem("listaCompras", JSON.stringify(listaCompras));

	// exclui do lista produtos (conexão atual e localstorage)
	listaProdutos.splice(indice, 1);
	localStorage.setItem("listaProdutos", JSON.stringify(listaProdutos));

	// chama a função para exibir a lista de produtos atualizada
	carregarProdutos();
}

// função utilizada para preencher o formulário com os dados do produto a ser editado
function editarProduto(indice) {
	
	// armazena os dados atuais e insere-os no formulário
	let produto = listaProdutos[indice];

	document.getElementById("input-indice").value = indice;
	document.getElementById("input-cod").value = produto.codigo;
	document.getElementById("input-nome").value = produto.nomeProduto;
	document.getElementById("input-qtd").value = produto.quantidade;
	document.getElementById("input-unidade").value = produto.unidade;
	document.getElementById("input-cod-barra").value = produto.codigoBarra;
	document.getElementById("input-ativo").checked = produto.produtoAtivo;

	// rola a tela até o topo, onde está o formulário
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// função que lista os produtos a serem comprados - chamada no onload do index
function carregaIndex() {

	// variáveis usadas para armazenar a div e o conteúdo
	let t1 = document.getElementById('lista-produtos');
	let linha = '';

	let descricaoUnidade;

	if (listaCompras.length > 0) { // se houver produtos na lista
		for (let i = 0; i < listaCompras.length; i++) {
			let { codigo, nomeProduto, quantidade, unidade, codigoBarra, produtoAtivo, qtd_comprado } = listaCompras[i];
			if (produtoAtivo && parseInt(quantidade) > 0) {
				let x = qtd_comprado ? qtd_comprado : 0;

				// Verifica a sigla da unidade do produto e mostra sua descrição
				if (unidade == "un") {
					descricaoUnidade = "Unidade";
				} else if (unidade == "kg") {
					descricaoUnidade = "Quilograma";
				} else if (unidade == "lt") {
					descricaoUnidade = "Litro";
				} else if (unidade == "mt") {
					descricaoUnidade = "Metro";
				} else if (unidade == "pc") {
					descricaoUnidade = "Pacote";
				}
				
				linha += `<form class="box-produto" id="produto-${i}">
											<img class="img-produto" src="imagens/product.png" alt="Imagem do produto" width="150px">
											
											<input class="nome-produto" type="text" name="nome_produto" readonly value="${nomeProduto}">
											<br>
											<input class="info-produto cod-produto" name="cod-produto" type="text" readonly value="${codigo}">
											<input class="info-produto uni-produto" name="uni-produto" type="text" readonly value="${descricaoUnidade}">
											<br>
											<input class="qtds-produto qtd-necessario" name="qtd_necessario" type="text" readonly value="${quantidade}">
											<input class="qtds-produto qtd-comprado" name="qtd_comprado" type="number" min="0" max="${quantidade}" value="${x}" onchange="verificaComprado('${i}', '${codigo}');">
											
											<div style="display: none;" class="tag-coletado">COLETADO</div>
									</form>`;
			}
		}
	} else { // se a lista for vazia
		linha += `<h4>Não existem produtos ativos na lista.</h4>`;
	}

	// insere o conteúdo na div
	t1.innerHTML = linha;

	// chama função que verifica se os produtos da lista já foram coletados
	verificaComprados();
}

//funçao que verifica se os produtos da lista já foram coletados
function verificaComprados() {
	let cont = 0;

	// percorre todos os itens da lista chamando a função de verificação
	for (let produto of listaCompras) {
		verificaComprado(cont, produto.codigo);
		cont++;
	}
}

//funcao que verifica se uma quantidade comprada de produto é a mesma que a quantidade necessaria
function verificaComprado(indice, codigo) {

	// armazena o formulário do produto
	let f = document.getElementById("produto-" + indice);

	// armazena as quantidades para comparação
	let qtdComprado = parseInt(f.qtd_comprado.value);
	let qtdNecessario = parseInt(f.qtd_necessario.value);

	// armazena a posição do produto na lista compras
	let index = getIndexProduto(listaCompras, codigo);

	if (qtdComprado >= qtdNecessario) { // se quantidade comprada for maior ou igual que a quantidade necessária
		f.nome_produto.style.textDecoration = "line-through"; // tacha o nome do produto
		f.getElementsByClassName("tag-coletado")[0].style.display = "block"; // exibe a tag "coletado" no produto
		f.qtd_comprado.value = qtdNecessario; // seta a quantidade máxima necessária no campo, caso tenha sido digitado um valor maior
		listaCompras[index].qtd_comprado = qtdNecessario; // atualiza a quantidade comprada na lista compras
		listaCompras[index].coletado = true; // marca como coletado na lista compras
	} else { // se a quantidade ainda não for o necessário
		f.getElementsByClassName("tag-coletado")[0].style.display = "none"; // remove a tag "coletado"
		f.nome_produto.style.textDecoration = "none"; // remove o tachado do nome
		listaCompras[index].qtd_comprado = qtdComprado; // atualiza com o quantidade comprada até o momento
		listaCompras[index].coletado = false; // marca como não coletado na lista compras
	}

	// atualiza lista compras no local storage
	localStorage.setItem("listaCompras", JSON.stringify(listaCompras));

	// chama a função que verifica se todos os produtos foram coletados
	if (verificaColetados()) { // se foram todos coletados
		document.getElementById("bt-servidor").removeAttribute("disabled"); // ativa o botão de envio para o servidor
	} else {
		document.getElementById("bt-servidor").setAttribute("disabled", "disabled"); // desativa o botão de envio para o servidor
	}
}

/* LISTA COMPRAS */

// para armazenar os produtos cadastrados e ativos
var listaCompras = [];

// se já tiver algum item armazenado no local storage, armazena na lista
if (localStorage.getItem("listaCompras")) {
	listaCompras = JSON.parse(localStorage.getItem("listaCompras"));
}

// verifica se os produtos foram todos coletados
function verificaColetados() {
	let coletados = true; // inicia como verdadeiro

	// percorre todos os itens da lista compras
	for (let i of listaCompras) {
		if (!i.coletado) { // se algum item não for coletado
			coletados = false; // seta como falso para retorno
		}
	}

	return coletados;
}

/* GERAL */

// retorna a posição da de um produto da lista a partir de um determinado codigo
function getIndexProduto(lista, cod) {
	return lista.findIndex(produto => produto.codigo == cod);
}

/* ENVIO PARA O SERVIDOR */

// armazena o link base da API
const LINK_BASE = "https://60df9f47abbdd9001722d43c.mockapi.io/Compras";

// função que é chamada no botao "Salvar"
function enviaServidor() {
	let link = LINK_BASE; // armazena o link base
	let metodo = 'post'; // método de chamada (post = para novo registro)
	let codLista; // armazenará o código da lista criada
	let dataLista = new Date().getTime(); // data atual
	let obj = {}; // armazenará os dados para envio
	
	obj.data = dataLista; // armazena a data

	// faz o primeiro envio (criação da lista de compras)
	fetch(link, {
		// passa como parâmetro o método e o objeto (dados da lista de compras)
		method: metodo,
		body: JSON.stringify(obj),
		headers: { 'Content-Type': 'application/json' }
	}
	).then(function (response) {
		// se retornar verdadeiro, faz o segundo envio
		if (response.ok) {
			return response.json();
		}
	}).then(function (json) {

		// armazena o código da lista criada para usar no link
		codLista = json.codCompras;

		// completa o link base com os parâmetros para envio dos produtos
		link = link + "/" + codLista + "/produtos";

		// percorre todos os itens da lista compras
		for (let produto of listaCompras) {

			// segundo envio (um para cada produto da lista)
			fetch(link, {
				// passa como parâmetro o método e o objeto (dados do produto)
				method: metodo,
				body: JSON.stringify(produto),
				headers: { 'Content-Type': 'application/json' }
			}
			).then(function (response) {
			}).then(function (json) {
			}).catch(function (error) {
				console.log('Deu ERRO:', error);
			});

		}

		// exibe uma mensagem de confirmação do envio
		alert("Sua lista de compras foi enviada para o servidor! A página será recarregada.");

		// limpa as informações da conexão atual
		listaCompras = [];
		listaProdutos = [];
		localStorage.removeItem('listaCompras');
		localStorage.removeItem('listaProdutos');

		// abre uma nova guia com o link da API onde a lista foi cadastrada
		window.open(link, '_blank').focus();

		// atualiza a página
		document.location.reload(false);

	}).catch(function (error) {
		console.log('Deu ERRO:', error);
	});
}