import re
import webbrowser
import pathlib
import json

with open("cinemaATP.json", encoding="utf8") as f:
    films = json.load(f)

nl='\n'
actors = dict()
genres = dict()

# Ter acesso ao índice de cada filme.
for i in range(len(films)):
    
    film = films[i]
    for actor in film["cast"]:
        actors.setdefault(actor,set())
        actors[actor].add(i)


    with open(f'films/f{i}.html',"w+",encoding="utf8") as page:
        page.write(
            f'''
<!DOCTYPE html>
<head>
    <title>Filme {i}</title>
    <meta charset="UTF-8"/>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
</head>

<body>
    <div style="margin: 40px">
        <div
        class="w3-container w3-center w3-teal"
        style="margin: auto; width: 60%; border: 5px solid teal"
        >
            <h1><b>{films[i]["title"]} - {films[i]["year"]}</b></h1>
        </div>
        <div
        class="w3-container w3-center"
        style="margin: auto; width: 60%; border: 5px solid teal"
        >
            <h2><b>Elenco:</b></h2>
            <div style="border: 2px solid">
                <ul class="w3-ul w3-hoverable">
                    {"".join(nl+'<li>'+actor+'</li>'for actor in films[i]["cast"])}
                </ul>
            </div>

            <h2><b>Género:</b></h2>
            <div style="border: 2px solid">
                <ul class="w3-ul w3-hoverable">
                    {"".join(nl+'<li>'+genre+'</li>'for genre in films[i]["genres"])}
                </ul>
            </div>
            <a href="../../" class="w3-bar-item w3-button w3-mobile">Voltar</a>
        </div>
    </div>
</body>
    '''
        )
#<a href="..." Se eu quiser meter a mandar para os atores

with open("index.html", "w+", encoding="utf8") as page:
    page.write(
        f'''
<!DOCTYPE html>
<head>
    <title>TPC 2 - Filmes</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
</head>

<body>
    <div style="margin: 40px">
        <div
        class="w3-container w3-center w3-teal"
        style="margin: auto; width: 60%; border: 5px solid teal"
        >
            <h1><b>Filmes disponíveis</b></h1>
        </div>
        <div
        class="w3-container w3-center"
        style="margin: auto; width: 60%; border: 5px solid teal"
        >
            <ul class="w3-ul w3-hoverable">
                {"".join(nl+'<li><a href=films/'+str(i)+'>'+films[i]["title"]+ ' - #'+str(i)+'</a></li>'for i in range(len(films)))}
            </ul>

        </div>
    </div>
</body>
        '''
    )

            
