import { useTheme } from '../context/ThemeContext';

const ThemeSettings = () => {
  const { currentTheme, changeTheme } = useTheme();
  
  const themes = [
    { name: 'light', label: 'Light', icon: '☀️' },
    { name: 'dark', label: 'Dark', icon: '🌙' },
    { name: 'calm', label: 'Calm', icon: '🌊' },
    { name: 'energetic', label: 'Energetic', icon: '⚡' }
  ];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Appearance</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {themes.map(theme => (
          <button
            key={theme.name}
            onClick={() => changeTheme(theme.name)}
            className={`p-3 rounded-lg border ${
              currentTheme === theme.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            } transition-colors flex flex-col items-center justify-center`}
          >
            <span className="text-2xl mb-1">{theme.icon}</span>
            <span className={`text-sm ${currentTheme === theme.name ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
              {theme.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSettings;