const links = [
    { 
        title: 'YouTube Channel', 
        url: 'https://www.youtube.com/@focustripodvz', 
        icon: 'fa-brands fa-youtube',
        hoverStyle: 'hover:bg-red-600/40 hover:border-red-500' 
    },
    { 
        title: 'Facebook Page', 
        url: 'https://www.facebook.com/marvellous.baloyi.3', 
        icon: 'fa-brands fa-facebook',
        hoverStyle: 'hover:bg-blue-600/40 hover:border-blue-500' 
    },
    { 
        title: 'LinkedIn Profile', 
        url: 'https://www.linkedin.com/in/marvellers-baloyi-9a658b340/', 
        icon: 'fa-brands fa-linkedin',
        hoverStyle: 'hover:bg-blue-700/40 hover:border-blue-400' 
    }
];

const container = document.getElementById('link-list');

// Function to render links
function renderLinks() {
    container.innerHTML = links.map(link => `
        <a href="${link.url}" 
           target="_blank" 
           class="glass-button flex items-center p-4 w-full rounded-2xl group ${link.hoverStyle}">
            <span class="text-2xl mr-4 text-gray-300 group-hover:text-white transition-transform group-hover:scale-110">
                <i class="${link.icon}"></i>
            </span>
            <span class="text-lg font-medium text-gray-100 group-hover:text-white">
                ${link.title}
            </span>
        </a>
    `).join('');
}

// Run the function
renderLinks();