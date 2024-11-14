import '../styles/styles.css'
import MobileMenu from './modules/MobileMenu'
import RevealOnScroll from './modules/RevealOnScroll'
import StickyHeader from './modules/StickyHeader'
import ClientArea from './modules/ClientArea'


// React Related Code Gose Here 
import React from "react"
import ReactDOM from "react-dom/client"

// Import React components that we created
import MyAmazingComponent from './modules/MyAmazingComponent'


ReactDOM.createRoot(document.querySelector("#my-react-example")).render(
    <React.StrictMode>
        <MyAmazingComponent />
    </React.StrictMode>
)


new ClientArea()
new StickyHeader()
new RevealOnScroll(document.querySelectorAll(".feature-item"), 75)
new RevealOnScroll(document.querySelectorAll(".testimonial"), 60)
new MobileMenu();
let modal

document.querySelectorAll(".open-modal").forEach(el => {
    el.addEventListener("click", e => {
        e.preventDefault()
        if (typeof modal == "undefined") {
            import(/* webpackChunkName:"modal" */ './modules/Modal').then(x => {
                modal = new x.default()
                setTimeout(() => modal.openTheModal(), 20)
            }).catch(() => console.log("There was a problem."))
        } else {
            modal.openTheModal()
        }
    })
})


if (module.hot) {
    module.hot.accept()
}

