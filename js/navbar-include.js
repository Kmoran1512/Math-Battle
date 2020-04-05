$('.head-nav-bar').append(`
    <nav class="navbar navbar-default">
        <div class="container-fluid">

            <div class="navbar-header">
                <a class="navbar-brand" href="about.html">Math Battle</a>
            </div>

            <ul class="nav navbar-nav">
                <li><a href="home.html">Home</a></li>
                <li><a href="compendium.html">Compendium</a></li>
                <li><a href="explain.html">How to Play</a></li>
                <li><a href="math_page.html">Math!</a></li>
            </ul>

            <ul class="nav navbar-nav navbar-right">
                <li><a href="account.html" class="p-username"><span class="glyphicon glyphicon-user"></span></a></li>
                <li><a id="log-out">  Logout  <span class="glyphicon glyphicon-log-in"></span></a></li>
            </ul>

        </div>
    </nav>
`)