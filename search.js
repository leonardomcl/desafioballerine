let ultimaBusca = '';

async function getData(url) {
    try {
        $("#overlay").fadeIn(300);
        let response = await fetch(`${url}`);
        if (!response.ok) {
            return 'error';
        }
        let data = await response.json();

        return data;
    } catch (error) {
        console.warn(error);
    }
}

$(".searchCol, .searchBar, .searchIcon ").click(function() {
    $(".inputSearch").focus();
});


$(".inputSearch").on('mouseleave', function(e) {
    let palavra = $(this).val().trim();

    if (palavra.length == 0) {
        $(".resultado").hide();
    }
});

$(".inputSearch").on('keyup', async function(e) {

    e.preventDefault();
    e.stopPropagation();

    let palavra = $(this).val().trim();

    if (e.key === "Escape") {
        $(this).val('');
        $(".resultado").html('');
        ultimaBusca = ''
        return false;
    }


    if (palavra.length == 0) {
        $(".resultado").html('');
        ultimaBusca = ''
        return false;
    }

    if (palavra.length > 4 && (palavra.length % 2) === 0 || palavra.length >= 8 && palavra != ultimaBusca) {

        let url = `https://discord.com/api//discovery/search?query=${palavra}&limit=8`;

        let resultado = await getData(url);

        if (resultado == 'error') {
            $("#overlay").fadeOut(300);
            return false;
        }

        $(".resultado").fadeIn(300);
        $(".resultado").html('');

        if (resultado.hits.length == 0) {
            $(".resultado").append('<p class="text-white">Nenhum resultado encontrado!</p>')
        } else {

            $(".resultado").append('<div class="server-list row row-cols-1 row-cols-md-1 g-3">');

            for await (const obj of resultado.hits) {
                let id = obj.id;
                let nome = obj.name;
                let desc = obj.description;
                let invite = obj.vanity_url_code;
                let membros = obj.approximate_member_count;
                let img = `https://cdn.discordapp.com/banners/${obj.id}/${obj.banner}`;

                let html = `<div class="mt-2 card server mb-3" ">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img src="${img}" class="img-fluid rounded-start mt-2" >
                      <p class='mt-2 mb-1  server-membros '>${membros} membros</p>
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <p class="card-title server-titulo">${nome}</p>
                        <small>${desc}</small>
                        <br>
                        <div class="d-grid gap-2 col-6 mx-auto"><button data_invite='${invite}' class='btn mt-3 btn-sm btn-outline-secondary btninvite'>Entrar</button></div>
                      </div>
                    </div>
                  </div>
                </div>`;

                $(".server-list").append(html);
            }
            $(".resultado").appendTo('</div></div>');
        }

        $("#overlay").fadeOut(300);

        ultimaBusca = palavra;
    }

});

$(document).on("click", '.btninvite', function() {
    let invitecode = $(this).attr("data_invite");
    let inviteurl = `https://discord.com/invite/${invitecode}`;
    window.open(inviteurl, '_blank');
});