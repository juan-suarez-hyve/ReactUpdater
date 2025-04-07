import HyperList from "hyperlist"
import FuzzySearch from 'fuzzy-search';
import iconsData from './data/icon-library.json';
import svgToTinyDataUri from 'mini-svg-data-uri';
import { CurrentIconColor } from "./models/currentIconColor";


export class iconManager implements Observer{
   
   
    private icons: Icon[][];
    private hyperlistInstance: HyperList | null = null;
    private filtered:boolean = false;
    private currentIconColor: CurrentIconColor;
    private favoritesList: string[];
    constructor(private iconBox: HTMLElement, observeCurrentIconColor: CurrentIconColor){
        this.currentIconColor = observeCurrentIconColor;
        this.favoritesList = JSON.parse(localStorage.getItem('favorites') || '[]');
    }
    update(currentIconColor:string): void {
        console.log(`currentIconColor is change to: ${currentIconColor}`);
    }
    
    loadIcons(filter: string = ''){
        this.iconBox.innerHTML = '';
        const allIcons = filter ? this.getIcons(filter) : this.getIcons();
        const favoriteIcons = allIcons.flat().filter(icon => this.favoritesList.includes(icon.id))
        this.icons = this.filtered ?  this.chunkIcons(favoriteIcons) : allIcons

        if(this.hyperlistInstance){
            this.hyperlistInstance.destroy;
            this.hyperlistInstance = null;
        }

        const config = {
            height: window.innerHeight,
            width: '100%',
            itemHeight: 110,
            total: this.icons.length,
            generate : (index: number) => this.generateIcon(this.icons[index])
        }
        this.hyperlistInstance = HyperList.create(this.iconBox, config)
    }
    

    getIcons(filter?: string):Icon[][] {
        const iconsCollection = Object.values(iconsData).filter(icon => icon.html)

        if (filter) {
        const fuzzyIcons = new FuzzySearch(iconsCollection, ['name', 'tags'])
        return this.chunkIcons(fuzzyIcons.search(filter));
        }
        return this.reduceIcons(iconsCollection)
    }
    reduceIcons(items: Array<{ id: string; category: string }>): Icon[][] {
        items.sort((a, b) => {
            if (a.category < b.category) {
              return -1;
            }
            if (a.category > b.category) {
              return 1;
            }
            return 0;
        });
    
        return items.reduce((acc, item) => {
        if (!item.id) {
            acc.push([item]);
        } else {
            const foundIndex = acc.findIndex(
            (elements) =>
                elements.length < 9 &&
                elements.some(
                (element: any) => element.category === item.category && element.id
                )
            );
            if (foundIndex === -1) {
            acc.push([item]);
            } else {
            acc[foundIndex].push(item);
            }
        }
        return acc;
        }, []);
    }

    generateIcon(tmpIcons: Icon[]):HTMLElement {
        const iconContainer = document.createElement('div');
        iconContainer.className = 'item';
        iconContainer.style.width = '80px';
        iconContainer.style.height = '80px';

        const currentColor = "#000000"

        iconContainer.innerHTML = tmpIcons
            .map((icon) => {
            let iconHTML = icon.html.replace(new RegExp(currentColor, 'g'), this.currentIconColor.getState());

            // manipulate the div to chage the color 
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = iconHTML;
            
            const captionElement = tempContainer.querySelector('.caption');
            if (captionElement instanceof HTMLElement) {
                captionElement.style.color = this.currentIconColor.getState();
            }

            //html modificated
            if (icon.id) {
                return `
                        <div class="icon" data-id="${icon.id}" draggable="true">
                        <button class='favorite'>
                            <img data-id="${icon.id}" src="src/img-fav/star.svg">
                        </button>
                        ${tempContainer.innerHTML}
                        </div>`
            } else {
                return `
                        <h2 class="category-tittle">
                        ${tempContainer.innerHTML}
                        </h2>`
            }
            }).join('');
        

        iconContainer.querySelectorAll('button.favorite').forEach((element) => {
            const imageFav = element.querySelector('img') as HTMLImageElement
            const id = imageFav.getAttribute('data-id')

            if (this.favoritesList.includes(id)) {
                imageFav.classList.add('button-click')
            }
            element.addEventListener('click', (event: MouseEvent) => {
                event.stopPropagation()

                const scrollPosition = this.iconBox.scrollTop

                if (this.favoritesList.includes(id)) {
                    this.favoritesList = this.favoritesList.filter((elm: string) => elm !== id)
                } else {
                    console.log(event.target)
                    this.favoritesList.push(id)
                }
                localStorage.setItem('favorites', JSON.stringify(this.favoritesList))
                this.loadIcons('')

                this.iconBox.scrollTop = scrollPosition
            })

        })

        iconContainer.querySelectorAll('.icon').forEach((element) => {
            element.addEventListener('click', () => {
                const svgElement = element.querySelector('svg')

                if (svgElement) {
                    const dataURL = svgToTinyDataUri(svgElement.outerHTML)
                    const link = document.createElement('a')
                    link.href = dataURL
                    link.download = element.getAttribute('data-id') + '.svg'
                    link.click()
                }
            })

            element.addEventListener('dragstart', (event: DragEvent) => {
                const target = event.target as HTMLElement
                event.preventDefault()
                const fileName = target.getAttribute('data-id')
                const svgElement = target.querySelector('svg')

                if (event.dataTransfer) {
                    event.dataTransfer.effectAllowed = 'copy'
                }

                if (!fileName || !svgElement) {
                    console.log("Error: Missing data")
                    return
                }
                window.electronAPI.send('ondragstart', fileName, svgElement.outerHTML)
            })
        })
        return iconContainer;
    }
    chunkIcons(favoriteIcons: Icon[], chunkSize = 9): Icon[][] {
        const listIcons: Icon[][] = [];
        for (let i = 0; i < favoriteIcons.length; i += chunkSize) {
            const chunk = favoriteIcons.slice(i, i + chunkSize);
            listIcons.push(chunk);
        }
        return listIcons
    }



    getHyperlistInstace(): HyperList {
        return this.hyperlistInstance
    }

    getFiltered(): Boolean{
        return this.filtered;
    }
    setFiltered(newFiltered: boolean): void{
        this.filtered = newFiltered;
    }
    
}